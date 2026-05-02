import { useEffect, useRef } from "react";
import { useBucketSelector } from "@/actions/bucket";
import { btFormFields } from "@/actions/buckets";

interface FSGSelectProps {
    name: string;
    id?: string;
    title?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    focus?: boolean;
    focusDelay?: number;
    helperText?: string;
    group?: string;
    rules?: string;
    value?: string | number;
    options?: React.ReactNode;
    children?: React.ReactNode;
    useErrors?: (name: string) => string[];
    useValue?: (name: string) => any;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    useTarget?: (name: string, value: string) => void;
    onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

function FSGSelect(props: FSGSelectProps) {
    const inputRef = useRef<HTMLSelectElement>(null);

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

    let value = props.value !== undefined
        ? props.value
        : props.useValue
        ? props.useValue(props.name)
        : useBucketSelector(btFormFields, (form: any) =>
              form[props.group!] && form[props.group!][props.name]
                  ? form[props.group!][props.name]
                  : null
          );
    value = value ?? "";

    return (
        <div className="w-full">
            {props.title && (
                <label className="block mb-1">
                    <span className="text-sm font-medium text-slate-700">
                        {props.title}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                </label>
            )}
            <select
                id={props.id}
                name={props.name}
                ref={inputRef}
                value={value}
                disabled={props.disabled}
                onFocus={props.onFocus}
                className={[
                    "w-full px-3 py-2 rounded-lg bg-slate-50 border text-slate-900 text-sm outline-none transition appearance-none",
                    errors.length > 0
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500",
                    props.disabled ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
                onChange={(e) => {
                    if (props.onChange) props.onChange(e);
                    if (props.useTarget) props.useTarget(props.name, e.target.value);
                }}
            >
                {props.placeholder && <option value="">{props.placeholder}</option>}
                {props.options}
                {props.children}
            </select>
            {errors.length > 0
                ? errors.map((error) => (
                      <p key={"error-" + props.name + "-" + error} className="mt-1 text-xs text-red-400">
                          {error}
                      </p>
                  ))
                : props.helperText && (
                      <p className="mt-1 text-xs text-slate-400">{props.helperText}</p>
                  )}
        </div>
    );
}

export default FSGSelect;
