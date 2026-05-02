import { useEffect, useRef, useState } from "react";

interface FSGButtonProps {
    title?: string;
    loadingTitle?: string;
    className?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

function FSGButton(props: FSGButtonProps) {
    const [loading, setLoading] = useState(false);
    const mounted = useRef(true);

    const title = loading ? props.loadingTitle || "Saving..." : props.title || "Save";

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    return (
        <button
            disabled={loading}
            className={props.className || "px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"}
            onClick={async (e) => {
                setLoading(true);
                try {
                    await props.onClick(e);
                } catch (err) {
                    console.error(err);
                    return;
                }
                if (mounted.current) setLoading(false);
            }}
        >
            {title}
        </button>
    );
}

export default FSGButton;
