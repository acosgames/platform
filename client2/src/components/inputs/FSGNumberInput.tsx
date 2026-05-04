import { useBucketSelector } from "@/actions/bucket";
import { btFormFields } from "@/actions/buckets";

interface FSGNumberInputProps {
    name: string;
    id?: string;
    title?: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    group?: string;
    useErrors?: (name: string) => string[];
    useValue?: (name: string) => any;
    onChange?: (value: string) => void;
    useTarget?: (name: string, value: number) => void;
}

export default function FSGNumberInput(props: FSGNumberInputProps) {
    let errors = props.useErrors ? props.useErrors(props.name) : [];
    errors = errors || [];

    let bucketValue = useBucketSelector(btFormFields, (form: any) =>
              form[props.group!] && form[props.group!][props.name] !== undefined
                  ? form[props.group!][props.name]
                  : null
          );

    let formValue = props.useValue
        ? props.useValue(props.name)
        : bucketValue;  

    if (typeof formValue === "undefined" || formValue == null) formValue = 0;

    const min = props.min;
    const max = props.max;
    const step = props.step || 1;

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
            <div className="flex items-center">
                <button
                    type="button"
                    disabled={props.disabled || (min !== undefined && formValue <= min)}
                    className="px-2 py-2 rounded-l-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 border-r-0 transition disabled:opacity-40"
                    onClick={() => {
                        let next = Number(formValue) - step;
                        if (min !== undefined) next = Math.max(next, min);
                        if (props.useTarget) props.useTarget(props.name, next);
                        if (props.onChange) props.onChange(String(next));
                    }}
                >
                    −
                </button>
                <input
                    type="number"
                    id={props.id}
                    name={props.name}
                    min={min}
                    max={max}
                    step={step}
                    value={formValue}
                    disabled={props.disabled}
                    placeholder={props.placeholder}
                    className={[
                        "flex-1 px-3 py-2 bg-slate-50 border-y text-slate-900 text-sm text-center outline-none transition",
                        errors.length > 0
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-200 focus:border-blue-500",
                    ].join(" ")}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (props.useTarget) props.useTarget(props.name, Number(val));
                        if (props.onChange) props.onChange(val);
                    }}
                />
                <button
                    type="button"
                    disabled={props.disabled || (max !== undefined && formValue >= max)}
                    className="px-2 py-2 rounded-r-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 border-l-0 transition disabled:opacity-40"
                    onClick={() => {
                        let next = Number(formValue) + step;
                        if (max !== undefined) next = Math.min(next, max);
                        if (props.useTarget) props.useTarget(props.name, next);
                        if (props.onChange) props.onChange(String(next));
                    }}
                >
                    +
                </button>
            </div>
            {errors.map((error) => (
                <p key={"error-" + props.name + "-" + error} className="mt-1 text-xs text-red-400">
                    {error}
                </p>
            ))}
        </div>
    );
}
