import { CompletionString } from "./CompletionString";

export class XmlTag {
    tag: CompletionString;
    base: string[];
    attributes: Array<CompletionString>;
    visible: boolean;
}