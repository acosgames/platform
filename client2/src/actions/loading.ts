import { useBucketSelector } from "./bucket";
import { btLoading } from "./buckets";


export function LOADING(name:string) {
    btLoading.assign({ [name]: 1 });
}

export function LOADED(name:string) {
    btLoading.assign({ [name]: 2 });
}

export function useLoading(name:string, bucket:any = btLoading) {
    let loaded = useBucketSelector(btLoading, (state:any) => state[name]);
    if( loaded == 2 ) return bucket.get();

    return null;
}