import { useRef } from "react";
import { useBucket } from "../../../actions/bucket";
import { btDevGameImages } from "../../../actions/buckets";
import { addImages } from "../../../actions/devgame";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DevImageUploadProps {
    uploadFunc?: Function;
}

export default function DevImageUpload({ uploadFunc }: DevImageUploadProps) {
    const images = useBucket(btDevGameImages) as any[];
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const newImages = [{ data_url: ev.target?.result as string, file }];
            addImages(newImages, uploadFunc!);
        };
        reader.readAsDataURL(file);
    };

    const currentImage = images?.[0];

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="relative w-full max-w-50 aspect-square rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-white/40 cursor-pointer transition bg-white/5 flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
            >
                {currentImage ? (
                    <>
                        <img
                            src={currentImage.data_url}
                            alt="Game preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-black/80 text-white transition z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                btDevGameImages.set([]);
                            }}
                        >
                            <XMarkIcon className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-white/40">
                        <ArrowUpTrayIcon className="w-8 h-8" />
                        <span className="text-xs">Click to upload</span>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
