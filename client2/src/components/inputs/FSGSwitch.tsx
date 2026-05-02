import { useEffect, useRef } from "react";
import { useBucketSelector } from "@/actions/bucket";
import { btFormFields } from "@/actions/buckets";

interface FSGSwitchProps {
    name: string;
    id?: string;
    title?: string;
    required?: boolean;
    focus?: boolean;
    focusDelay?: number;
    disabled?: boolean;
    horizontal?: boolean;
    group?: string;
    rules?: string;
    useErrors?: (name: string) => string[];
    useValue?: (name: string) => any;
    onChange?: (e: { target: { name: string; checked: boolean } }) => void;
    useTarget?: (name: string, value: boolean) => void;
}

export default function FSGSwitch(props: FSGSwitchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.focus) {
            setTimeout(() => {
                inputRef?.current?.focus();
            }, props.focusDelay || 300);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let errors = props.useErrors ? props.useErrors(props.name) : [];
    errors = errors || [];

    const value = props.useValue
        ? props.useValue(props.name)
        : useBucketSelector(btFormFields, (form: any) =>
              form[props.group!] && form[props.group!][props.name] !== undefined
                  ? form[props.group!][props.name]
                  : null
          );
    const checked = !!value;

    const wrapperClass = props.horizontal
        ? "flex flex-row items-center gap-3"
        : "flex flex-col gap-1";

    return (
        <div className={wrapperClass}>
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                    className={[
                        "relative w-11 h-6 rounded-full transition-colors",
                        checked ? "bg-blue-600" : "bg-slate-200",
                        props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                    ].join(" ")}
                    onClick={() => {
                        if (props.disabled) return;
                        const next = !checked;
                        if (props.useTarget) props.useTarget(props.name, next);
                        if (props.onChange) props.onChange({ target: { name: props.name, checked: next } });
                    }}
                >
                    <div
                        className={[
                            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                            checked ? "translate-x-5" : "translate-x-0",
                        ].join(" ")}
                    />
                    <input
                        ref={inputRef}
                        type="checkbox"
                        id={props.id}
                        name={props.name}
                        checked={checked}
                        disabled={props.disabled}
                        className="sr-only"
                        onChange={(e) => {
                            if (props.useTarget) props.useTarget(props.name, e.target.checked);
                            if (props.onChange) props.onChange(e);
                        }}
                    />
                </div>
                {props.title && (
                    <span className="text-sm font-medium text-slate-700">
                        {props.title}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                )}
            </label>
            {errors.map((error) => (
                <p key={"error-" + props.name + "-" + error} className="text-xs text-red-400">
                    {error}
                </p>
            ))}
        </div>
    );
}
