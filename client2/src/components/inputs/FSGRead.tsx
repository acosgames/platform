interface FSGReadProps {
    title?: string;
    value?: any;
    helpText?: string;
    required?: boolean;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
}

function FSGRead(props: FSGReadProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {props.title && (
                <p className="text-sm font-medium text-white/60">
                    {props.title}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </p>
            )}
            <p className="text-sm text-white/80">{props.value}</p>
            {props.helpText && (
                <p className="text-xs text-white/40">{props.helpText}</p>
            )}
        </div>
    );
}

export default FSGRead;
