export class XmlDiagnosticData {
    line: number;
    column: number;
    message: string;
    severity: "error" | "warning" | "info" | "hint";
}