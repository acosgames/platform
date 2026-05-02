import { useEffect, useState } from "react";
import { updateGameField } from "@/actions/devgame";

const regexColorHex = /^#([0-9a-fA-F]{3}){1,2}$/i;

interface FSGColorPickerProps {
    name: string;
    id?: string;
    title?: string;
    value?: string;
    group?: string;
    rules?: string;
    error?: string;
    onChange: (color: string) => void;
}

function FSGColorPicker(props: FSGColorPickerProps) {
    let defaultValue = props.value || "#ff0000";
    if (!regexColorHex.test(defaultValue)) defaultValue = "#ff0000";

    const [colorValue, setColorValue] = useState(defaultValue);

    useEffect(() => {
        if (!regexColorHex.test(props.value || "")) {
            if (props.rules && props.group) {
                updateGameField(props.name, "#ff0000",  props.group, );
            }
            props.onChange("#ff0000");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (hex: string) => {
        if (props.rules && props.group) {
            updateGameField(props.name, hex, props.group);
        }
        props.onChange(hex);
        setColorValue(hex);
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {props.title && (
                <label className="text-sm font-medium text-white/80">{props.title}</label>
            )}
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    id={props.id}
                    name={props.name}
                    value={colorValue}
                    className="w-10 h-10 rounded cursor-pointer border border-white/10 bg-transparent p-0.5"
                    onChange={(e) => handleChange(e.target.value)}
                />
                <input
                    type="text"
                    value={colorValue}
                    maxLength={7}
                    className="w-28 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500 transition font-mono uppercase"
                    onChange={(e) => {
                        const hex = e.target.value;
                        if (regexColorHex.test(hex)) handleChange(hex);
                        else setColorValue(hex);
                    }}
                />
                <div
                    className="w-8 h-8 rounded border border-white/20"
                    style={{ backgroundColor: colorValue }}
                />
            </div>
        </div>
    );
}

export default FSGColorPicker;
