import { useBucketSelector } from "@/actions/bucket.ts";
import { btShowLoadingBox } from "../../actions/buckets";

interface LoadingBoxProps {
    id: string;
}

function LoadingBox({ id }: LoadingBoxProps) {
    const isLoading = useBucketSelector(
        btShowLoadingBox,
        (bucket) => (bucket as Record<string, any>)[id]
    );

    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <span className="text-white text-sm tracking-widest uppercase opacity-80">Loading...</span>
        </div>
    );
}

export default LoadingBox;
