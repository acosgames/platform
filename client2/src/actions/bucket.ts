import { useSyncExternalStore, useRef, useCallback } from "react";

export const compareStringified = (a: any, b: any) =>
    JSON.stringify(a) !== JSON.stringify(b);

type BucketStore<T = any> = {
    state: T;
}

type BucketType<T = any> = {
    state: T;
    store: BucketStore<T>;
    _get: () => BucketStore<T>;
    get: (selector?: (state: T) => any) => any;
    set: (toValue: T | ((currentValue: T) => T)) => void;
    cset: (toValue: T | ((currentValue: T) => T)) => void;
    assign: (kvOrkey: Partial<T> | string, toValue?: any) => void;
    cassign: (toValue: Partial<T>) => void;
    subscribe: (subscriber: (store: BucketStore<T>) => void) => () => void;
    emit: () => void;
    copy: (selector?: (state: T) => any) => any;
    _copy: () => any;
};

export const bucket = <T = any>(initialState?: T): BucketType<T> => {
    let subscribers = new Set<(store: BucketStore<T>) => void>();
    let newBucket: BucketType<T> = {} as BucketType<T>;

    newBucket.store =
        typeof initialState === "undefined"
            ? { state: null as unknown as T }
            : { state: initialState };

    newBucket._get = () => newBucket.store;
    newBucket.get = (selector) =>
        selector
            ? selector(newBucket.store.state)
            : newBucket.store.state;
    newBucket.set = (toValue) => {
        const resolved = typeof toValue === "function"
            ? (toValue as (currentValue: T) => T)(newBucket.get())
            : toValue as T;
        newBucket.store = { state: resolved };
        newBucket.emit();
    };
    newBucket.cset = (toValue) => {
        const resolved = typeof toValue === "function"
            ? (toValue as (currentValue: T) => T)(newBucket.get())
            : toValue as T;
        newBucket.store = { state: structuredClone(resolved) };
        newBucket.emit();
    };
    newBucket.assign = (kvOrkey: Partial<T> | string, toValue?: any) => {
        if (typeof kvOrkey === "string") {
            newBucket.store = {
                state: Object.assign({}, newBucket.store.state, { [kvOrkey]: toValue }),
            };
        } else {
            newBucket.store = {
                state: Object.assign({}, newBucket.store.state, kvOrkey),
            };
        }
        newBucket.emit();
    };
    newBucket.cassign = (toValue) => {
        newBucket.store = {
            state: Object.assign(
                {},
                newBucket.store.state,
                structuredClone(toValue)
            ),
        };
        newBucket.emit();
    };
    newBucket.subscribe = (subscriber: (store: BucketStore<T>) => void) => {
        subscribers.add(subscriber);
        return () => {
            subscribers.delete(subscriber);
        };
    };
    newBucket.emit = () => {
        subscribers.forEach((subscriber) => subscriber(newBucket._get()));
    };
    newBucket.copy = (selector) => structuredClone(newBucket.get(selector));
    newBucket._copy = () => structuredClone(newBucket._get());
    return newBucket;
};

export function useBucket<T = any>(bucket: BucketType<T>, comparator?: (a: T, b: T) => boolean): T | undefined {
    let currentStore = useRef(bucket._get());
    const getSnapshot = () => bucket._get();
    let newState = useSyncExternalStore(
        useCallback(
            (cb) =>
                bucket.subscribe((store: BucketStore<T>) => {
                    const nextStore = store;
                    if (
                        comparator &&
                        comparator(currentStore.current.state, nextStore.state)
                    )
                        return;
                    if (!comparator && currentStore.current === nextStore)
                        return;
                    currentStore.current = nextStore;
                    cb();
                }),
            []
        ),
        getSnapshot,
        () => undefined
    );
    return newState?.state as T | undefined;
}

export function useBucketSelector<T = any, R = any>(bucket: BucketType<T>, selector: (state: T) => R, comparator?: (a: R, b: R) => boolean): R {
    let currentStore = useRef(selector(bucket._get().state));
    const getSnapshot = () => selector(bucket._get().state);
    let newState = useSyncExternalStore(
        useCallback(
            (cb) =>
                bucket.subscribe((store: BucketStore<T>) => {
                    const nextState = selector(store.state); //selector(store.state || {});
                    if (
                        comparator &&
                        comparator(currentStore.current, nextState)
                    )
                        return;
                    if (!comparator && currentStore.current === nextState)
                        return;
                    currentStore.current = nextState;
                    cb();
                }),
            []
        ),
        getSnapshot
    );
    return newState;
}

export function useBucketSelectorX<T = any, R = any>(bucket: BucketType<T>, selector: (state: T) => R, comparator?: (a: R, b: R) => boolean): [R] {
    let currentStore = useRef(selector(bucket._get().state));
    const getSnapshot = () => selector(bucket._get().state);
    let newState = useSyncExternalStore(
        useCallback(
            (cb) =>
                bucket.subscribe((store: BucketStore<T>) => {
                    const nextState = selector(store.state); //selector(store.state || {});
                    if (
                        comparator &&
                        comparator(currentStore.current, nextState)
                    )
                        return;
                    if (!comparator && currentStore.current === nextState)
                        return;
                    currentStore.current = structuredClone(nextState);
                    cb();
                }),
            []
        ),
        getSnapshot
    );
    return [newState];
}

export function useBuckets(
    buckets: BucketType[],
    comparator?: (previous: any, next: any, index: number) => boolean
) {
    const bucketsRef = useRef(buckets);
    bucketsRef.current = buckets;
    const comparatorRef = useRef(comparator);
    comparatorRef.current = comparator;

    const currentStates = useRef(buckets.map((item) => item._get().state));

    // Returns the same reference until values actually change — prevents
    // useSyncExternalStore from seeing a new snapshot on every call and
    // looping infinitely.
    const getSnapshot = useCallback(() => currentStates.current, []);

    const states = useSyncExternalStore(
        useCallback(
            (cb) => {
                const onStoreUpdate = () => {
                    const previous = currentStates.current;
                    const next = bucketsRef.current.map((item) => item._get().state);
                    const hasChanged =
                        previous.length !== next.length ||
                        next.some((value, index) => {
                            const cmp = comparatorRef.current;
                            if (cmp) return !cmp(previous[index], value, index);
                            return previous[index] !== value;
                        });

                    if (!hasChanged) return;
                    currentStates.current = next;
                    cb();
                };

                const unsubscribers = bucketsRef.current.map((item) =>
                    item.subscribe(onStoreUpdate)
                );

                return () => {
                    unsubscribers.forEach((unsubscribe) => unsubscribe());
                };
            },
            [] // empty deps — latest buckets/comparator read via refs
        ),
        getSnapshot
    );

    return states;
}
