import { updateGameField, uploadGameImages } from "../../../actions/devgame";
import FSGTextInput from "../../../components/inputs/FSGTextInput";
import { Markdown, MarkdownPreview } from "../../../components/inputs/Markdown";
import { useBucket } from "../../../actions/bucket";
import { btFormFields } from "../../../actions/buckets";
import DevImageUpload from "./ImageUpload";
import schema from "shared/model/schema.json";

export default function TabPageInfo() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_3fr] gap-6">
            <FeaturedImage />
            <div className="flex flex-col gap-6">
                <EditGameInfo />
                <DescriptionPreview />
            </div>
        </div>
    );
}

function FeaturedImage() {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Featured Image</h3>
            <DevImageUpload uploadFunc={uploadGameImages} />
            <p className="text-xs text-slate-400">
                Dimensions: 512x512 pixels
                <br />
                Image should be square
            </p>
        </div>
    );
}

function EditGameInfo() {
    const group = "update-game_info";
    const rules = (schema as any)[group];
    const form = useBucket(btFormFields, () => true) as any;
    const formGroup = form[group] || {};

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateGameField(e.target.name, e.target.value, group);
    };

    const onChangeByName = (name: string, value: any) => {
        updateGameField(name, value, group);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-5">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Game Information</h3>
            <FSGTextInput
                rules={group}
                group={group}
                name="name"
                id="name"
                title="Game Name"
                maxLength={60}
                required={rules?.["name"]?.required}
                value={formGroup.name || ""}
                onChange={inputChange}
            />
            <FSGTextInput
                type="text"
                rules={group}
                group={group}
                name="shortdesc"
                id="shortdesc"
                title="Short Description"
                maxLength={120}
                required={rules?.["shortdesc"]?.required}
                value={formGroup.shortdesc || ""}
                onChange={inputChange}
            />
            <Markdown
                name="longdesc"
                rules={group}
                group={group}
                id="longdesc"
                title="Long Description"
                maxLength={5000}
                required={rules?.["longdesc"]?.required}
                value={formGroup.longdesc || ""}
                onChange={(e: any) => {
                    onChangeByName("longdesc", e);
                }}
            />
        </div>
    );
}

function DescriptionPreview() {
    const group = "update-game_info";
    const form = useBucket(btFormFields, () => true) as any;
    const formGroup = form[group] || {};

    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-3">Long Description Preview</h3>
            <div className="prose max-w-none text-sm text-slate-700">
                <MarkdownPreview value={formGroup.longdesc} title="Description" />
            </div>
        </div>
    );
}
