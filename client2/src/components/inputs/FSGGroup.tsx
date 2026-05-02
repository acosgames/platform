interface FSGGroupProps {
    title?: string;
    className?: string;
    innerClassName?: string;
    helpText?: string;
    children?: React.ReactNode;
}

function FSGGroup(props: FSGGroupProps) {
    return (
        <div className={["w-full", props.className || ""].join(" ")}>
            {props.title && (
                <div className="px-3 py-2 mb-2 bg-white/5 rounded text-white font-bold text-base">
                    {props.title}
                </div>
            )}
            <div className={["flex flex-col gap-6 px-4 py-3", props.innerClassName || ""].join(" ")}>
                {props.children}
                {props.helpText && (
                    <p className="text-xs text-white/40">{props.helpText}</p>
                )}
            </div>
        </div>
    );
}

export default FSGGroup;
