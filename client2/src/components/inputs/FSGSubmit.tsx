import { useEffect, useRef, useState } from "react";

interface FSGSubmitProps {
    title?: string;
    loadingTitle?: string;
    disabled?: boolean;
    className?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

function FSGSubmit(props: FSGSubmitProps) {
    const [loading, setLoading] = useState(false);
    const mounted = useRef(true);

    let title = props.title || "Save";
    if (loading) {
        title = props.loadingTitle || "Saving...";
    }

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    return (
        <button
            disabled={loading || props.disabled}
            className={[
                "px-5 py-2 rounded-lg text-sm font-medium transition",
                loading || props.disabled
                    ? "opacity-50 cursor-not-allowed bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer",
                props.className || "",
            ].join(" ")}
            onClick={async (e) => {
                if (loading) return;
                setLoading(true);
                try {
                    await props.onClick(e);
                } catch (err) {
                    console.error(err);
                }
                if (mounted.current) setLoading(false);
            }}
        >
            {title}
        </button>
    );
}

export default FSGSubmit;
