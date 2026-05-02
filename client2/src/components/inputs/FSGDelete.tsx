import { useState } from "react";

interface FSGDeleteProps {
    title?: string;
    loadingTitle?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

function FSGDelete(props: FSGDeleteProps) {
    const [loading, setLoading] = useState(false);

    const title = loading ? props.loadingTitle || "Deleting..." : props.title || "Delete";

    return (
        <button
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async (e) => {
                setLoading(true);
                try {
                    await props.onClick(e);
                } catch (err) {
                    console.error(err);
                }
            }}
        >
            {title}
        </button>
    );
}

export default FSGDelete;
