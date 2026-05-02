import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useBucketSelector } from "@/actions/bucket";
import { btFormFields } from "@/actions/buckets";
import { updateGameField } from "@/actions/devgame";
import "./Markdown.css";

interface MarkdownPreviewProps {
    title?: string;
    value?: string;
}

export function MarkdownPreview({ value }: MarkdownPreviewProps) {
    return (
        <div className="mt-4" id="game-info-longdesc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
    );
}

interface MarkdownProps {
    name: string;
    id?: string;
    title?: string;
    group?: string;
    rules?: string;
    error?: string;
    helpText?: string;
    maxLength?: number;
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

export function Markdown(props: MarkdownProps) {
    const value = useBucketSelector(btFormFields, (form: any) =>
        form[props.group!] && form[props.group!][props.name]
            ? form[props.group!][props.name]
            : null
    ) || "";

    const handleChange = (newValue: string) => {
        if (props.rules && props.group) {
            updateGameField(props.name, newValue, props.group);
        }
        if (props.onChange) props.onChange(newValue);
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {props.title && (
                <label className="text-sm font-medium text-slate-700">{props.title}</label>
            )}
            <textarea
                name={props.name}
                id={props.id}
                value={value}
                rows={12}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:border-blue-500 transition resize-y font-mono"
                onChange={(e) => handleChange(e.target.value)}
            />
            {props.helpText && (
                <p className="text-xs text-slate-400">{props.helpText}</p>
            )}
        </div>
    );
}
