import * as vscode from 'vscode';
import { AxamlCompleteSettings } from "./Types/AxamlCompleteSettings";

export declare let globalSettings: AxamlCompleteSettings;

export const languageId = 'xml';

export function loadSettings(): void {

    const section = vscode.workspace.getConfiguration("axamlComplete", null);

    this.globalSettings = new AxamlCompleteSettings();
    this.globalSettings.xsdCachePattern = section.get('xsdCachePattern', undefined);
    this.globalSettings.schemaMapping = section.get('schemaMapping', []);
    this.globalSettings.formattingStyle = section.get('formattingStyle', "singleLineAttributes");
}