export class AxamlCompleteSettings {
    xsdCachePattern?: string;
    schemaMapping: Array<{ xmlns: string, xsdUri: string, strict: boolean; }>;
    formattingStyle: "singleLineAttributes" | "multiLineAttributes" | "fileSizeOptimized";
}
