import type { ReactNode } from "react";

interface PanelProps {
    header: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export function Panel({ header, children, footer, className }: PanelProps) {
    const contentClassName = footer !== undefined
        ? "relative z-10 -mt-2 -mb-2 rounded-xl bg-white flex-1"
        : "relative z-10 -mt-2 rounded-xl bg-white flex-1";

    return (
        <div className={`flex flex-col rounded-xl bg-white overflow-hidden shadow-[0_10px_20px_rgba(15,23,42,0.10)] ${className ?? ""}`}>
            {/* Header — blue background */}
            
                {header}

            {/* Content — white, overlays header with rounded top border, grows to fill */}
            <div className={contentClassName}>
                {children}
            </div>

            {/* Footer (optional) — light gray, overlays content with rounded top border */}
            {footer !== undefined && (
                <div className="relative -mt-2 rounded-t-xl bg-slate-100 pt-2">
                    {footer}
                </div>
            )}
        </div>
    );
}
