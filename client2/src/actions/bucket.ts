import { useSyncExternalStore, useRef, useCallback } from "react";

export const compareStringified = (a: any, b: any) =>
    JSON.stringify(a) !== JSON.stringify(b);

type BucketStore = {
    state: any;
}

type BucketType = {
    state: any;
    store: BucketStore;
    _get: () => BucketStore;
    get: (selector?: (state: any) => any) => any;
    set: (toValue: any | ((currentValue: any) => any)) => void;
    cset: (toValue: any | ((currentValue: any) => any)) => void;
    assign: (toValue: any) => void;
    cassign: (toValue: any) => void;
    subscribe: (subscriber: (store: BucketStore) => void) => () => void;
    emit: () => void;
    copy: (selector?: (state: any) => any) => any;
    _copy: () => any;
};

export const bucket = (initialState: any) => {
    let subscribers = new Set<(store: BucketStore) => void>();
    let newBucket: BucketType = {} as BucketType;

    newBucket.store =
        typeof initialState === "undefined"
            ? { state: null }
            : { state: initialState };

    newBucket._get = () => newBucket.store;
    newBucket.get = (selector) =>
        selector
            ? selector(newBucket.store.state || {})
            : newBucket.store.state;
    newBucket.set = (toValue) => {
        if (typeof toValue === "function") {
            toValue = toValue(newBucket.get());
        }
        newBucket.store = { state: toValue };
        newBucket.emit();
    };
    newBucket.cset = (toValue) => {
        if (typeof toValue === "function") {
            toValue = toValue(newBucket.get());
        }
        newBucket.store = { state: structuredClone(toValue) };
        newBucket.emit();
    };
    newBucket.assign = (toValue) => {
        newBucket.store = {
            state: Object.assign({}, newBucket.store.state, toValue),
        };
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
    newBucket.subscribe = (subscriber: (store: { state: any }) => void) => {
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

export function useBucket(bucket:BucketType, comparator?: (a: any, b: any) => boolean) {
    let currentStore = useRef(bucket._get());
    const getSnapshot = () => bucket._get();
    let newState = useSyncExternalStore(
        useCallback(
            (cb) =>
                bucket.subscribe((store: BucketStore) => {
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
    return newState?.state;
}

export function useBucketSelector(bucket: BucketType, selector: (state: any) => any, comparator?: (a: any, b: any) => boolean) {
    let currentStore = useRef(selector(bucket._get().state));
    const getSnapshot = () => selector(bucket._get().state);
    let newState = useSyncExternalStore(
        useCallback(
            (cb) =>
                bucket.subscribe((store: BucketStore) => {
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

export function useBucketSelectorX(bucket: BucketType, selector: (state: any) => any, comparator?: (a: any, b: any) => boolean) {
    let currentStore = useRef(selector(bucket._get().state));
    const getSnapshot = () => selector(bucket._get().state);
    let newState = useSyncExternalStore(
        useCallback(
            (cb) =>
                bucket.subscribe((store: BucketStore) => {
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
