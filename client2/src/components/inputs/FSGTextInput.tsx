import { useEffect, useRef } from "react";
import { useBucketSelector } from "@/actions/bucket";
import { btFormFields } from "@/actions/buckets";

interface FSGTextInputProps {
    name: string;
    id?: string;
    type?: string;
    title?: string;
    rules?: string;
    placeholder?: string;
    maxLength?: number;
    value?: string;
    disabled?: boolean;
    autoComplete?: string;
    required?: boolean;
    focus?: boolean;
    focusDelay?: number;
    uppercase?: boolean;
    regex?: RegExp;
    float?: boolean;
    helperText?: string;
    group?: string;
    useErrors?: (name: string) => string[];
    useValue?: (name: string) => any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    useTarget?: (name: string, value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function FSGTextInput(props: FSGTextInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    let errors = props.useErrors ? props.useErrors(props.name) : [];
    errors = errors || [];

    const formValue = props.useValue
        ? props.useValue(props.name)
        : useBucketSelector(btFormFields, (form: any) =>
              form[props.group!] && form[props.group!][props.name]
                  ? form[props.group!][props.name]
                  : null
          );

    useEffect(() => {
        if (props.focus) {
            setTimeout(() => {
                inputRef?.current?.focus();
            }, props.focusDelay || 300);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = typeof formValue !== "undefined" ? formValue : props.value || "";

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
            <input
                name={props.name}
                id={props.id}
                ref={inputRef}
                type={props.type || "text"}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
                value={value || ""}
                disabled={props.disabled}
                autoComplete={props.autoComplete}
                onKeyDown={props.onKeyDown}
                onFocus={props.onFocus}
                className={[
                    "w-full px-3 py-2 rounded-lg bg-slate-50 border text-slate-900 text-sm placeholder-slate-300 outline-none transition",
                    errors.length > 0
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500",
                    props.disabled ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
                onChange={(e) => {
                    let fixedValue = e.target.value;
                    if (props.uppercase) fixedValue = fixedValue.toUpperCase();
                    if (props.regex) fixedValue = fixedValue.replace(props.regex, "");
                    if (props.float)
                        fixedValue = fixedValue
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*?)\..*/g, "$1");
                    if (props.onChange) props.onChange(e);
                    if (props.useTarget) props.useTarget(props.name, fixedValue);
                }}
            />
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

export default FSGTextInput;
