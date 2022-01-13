import * as vscode from 'vscode';
import * as CompletionSettings from './CompletionSettings';
import AxamlCompletionItemProvider from './AxamlCompletionItemProvider';
import { XmlSchemaPropertiesArray } from './Types/XmlSchemaPropertiesArray';
import AxamlLinterProvider from './AxamlLinterProvider';

export function xamlActivate(context: vscode.ExtensionContext): void {
    console.debug("Active XamlComplete");

    CompletionSettings.loadSettings();

    const schemaPropertyArray = new XmlSchemaPropertiesArray();
    const axamlCompletionProvider = vscode.languages.registerCompletionItemProvider(
        { language: CompletionSettings.languageId, scheme: 'file' },
        new AxamlCompletionItemProvider(context, schemaPropertyArray));

    const axamllinterProvider = new AxamlLinterProvider(context, schemaPropertyArray);
    
    context.subscriptions.push(
        axamlCompletionProvider,
        axamllinterProvider);
}