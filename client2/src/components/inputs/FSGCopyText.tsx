interface FSGCopyTextProps {
    name?: string;
    id?: string;
    copyRef?: React.Ref<HTMLInputElement>;
    value?: string;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function FSGCopyText(props: FSGCopyTextProps) {
    return (
        <input
            name={props.name}
            id={props.id}
            ref={props.copyRef}
            value={props.value || ""}
            onFocus={props.onFocus}
            readOnly
            className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs outline-none font-mono truncate"
        />
    );
}

export default FSGCopyText;
