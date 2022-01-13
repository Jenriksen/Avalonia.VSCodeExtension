import * as vscode from 'vscode';
import AxamlParser from './Helpers/AxamlParser';
import XsdCachedLoader from './Helpers/XsdCacheLoader';
import XsdParser from './Helpers/XsdParser';
import { globalSettings, languageId } from './CompletionSettings';
import { XmlDiagnosticData } from './Types/XmlDiagnosticData';
import { XmlSchemaPropertiesArray } from './Types/XmlSchemaPropertiesArray';
import { XmlTagCollection } from './Types/XmlTagCollection';
import { XmlSchemaProperties } from './Types/XmlSchemaProperties';

export default class XmlLinterProvider implements vscode.Disposable {

    private documentListener: vscode.Disposable;
    private diagnosticCollection: vscode.DiagnosticCollection;
    private delayCount: number = Number.MIN_SAFE_INTEGER;
    private textDocument: vscode.TextDocument;
    private linterActive = false;

    constructor(protected extensionContext: vscode.ExtensionContext, protected schemaPropertiesArray: XmlSchemaPropertiesArray) {
        this.schemaPropertiesArray = schemaPropertiesArray;
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

        this.documentListener = vscode.workspace.onDidChangeTextDocument(evnt =>
            this.triggerDelayedLint(evnt.document), this, this.extensionContext.subscriptions);

        vscode.workspace.onDidOpenTextDocument(doc =>
            this.triggerDelayedLint(doc, 100), this, extensionContext.subscriptions);

        vscode.workspace.onDidCloseTextDocument(doc =>
            this.cleanupDocument(doc), null, extensionContext.subscriptions);

        vscode.workspace.textDocuments.forEach(doc =>
            this.triggerDelayedLint(doc, 100), this);
    }

    public dispose(): void {
        this.documentListener.dispose();
        this.diagnosticCollection.clear();
    }

    private cleanupDocument(textDocument: vscode.TextDocument): void {
        this.diagnosticCollection.delete(textDocument.uri);
    }

    private async triggerDelayedLint(textDocument: vscode.TextDocument, timeout = 2000): Promise<void> {
        if (this.delayCount > Number.MIN_SAFE_INTEGER) {
            this.delayCount = timeout;
            this.textDocument = textDocument;
            return;
        }
        this.delayCount = timeout;
        this.textDocument = textDocument;

        const tick = 100;

        while (this.delayCount > 0 || this.linterActive) {
            await new Promise(resolve => setTimeout(resolve, tick));
            this.delayCount -= tick;
        }

        try {
            this.linterActive = true;
            await this.triggerLint(this.textDocument);
        }
        finally {
            this.delayCount = Number.MIN_SAFE_INTEGER;
            this.linterActive = false;
        }
    }

    private async triggerLint(textDocument: vscode.TextDocument): Promise<void> {

        if (textDocument.languageId !== languageId) {
            return;
        }

        const t0 = new Date().getTime();
        const diagnostics: Array<vscode.Diagnostic[]> = new Array<vscode.Diagnostic[]>();
        try {
            const documentContent = textDocument.getText();

            const xsdFileUris = (await AxamlParser.getSchemaXsdUris(documentContent, textDocument.uri.toString(true), globalSettings.schemaMapping))
                .map(u => vscode.Uri.parse(u))
                .filter((v, i, a) => a.findIndex(u => u.toString() === v.toString()) === i)
                .map(u => ({ uri: u, parentUri: u }));

            const nsMap = await AxamlParser.getNamespaceMapping(documentContent);

            const text = textDocument.getText();

            if (xsdFileUris.length === 0) {
                const plainXmlCheckResults = await AxamlParser.getXmlDiagnosticData(text, [], nsMap, false);
                diagnostics.push(this.getDiagnosticArray(plainXmlCheckResults));
            }

            const currentTagCollections: XmlTagCollection[] = [];

            while (xsdFileUris.length > 0) {
                const currentUriPair = xsdFileUris.shift() || { uri: vscode.Uri.parse(``), parentUri: vscode.Uri.parse(``) };
                const xsdUri = currentUriPair.uri;

                if (this.schemaPropertiesArray.filterUris([xsdUri]).length === 0) {
                    const schemaProperty = { schemaUri: currentUriPair.uri, parentSchemaUri: currentUriPair.parentUri, xsdContent: ``, tagCollection: new XmlTagCollection() } as XmlSchemaProperties;

                    try {
                        const xsdUriString = xsdUri.toString(true);
                        schemaProperty.xsdContent = await XsdCachedLoader.loadSchemaContentsFromUri(xsdUriString, true);
                        schemaProperty.tagCollection = await XsdParser.getSchemaTagsAndAttributes(schemaProperty.xsdContent, xsdUriString, (u) => xsdFileUris.push({ uri: vscode.Uri.parse(AxamlParser.ensureAbsoluteUri(u, xsdUriString)), parentUri: currentUriPair.parentUri }));
                        console.log(`Loaded ...${xsdUri.toString().substr(xsdUri.path.length - 16)}`);
                    }
                    catch (err) {
                        vscode.window.showErrorMessage(err.toString());
                    } finally {
                        this.schemaPropertiesArray.push(schemaProperty);
                        currentTagCollections.push(schemaProperty.tagCollection);
                    }
                }
            }

            const diagnosticResults = await AxamlParser.getXmlDiagnosticData(text, currentTagCollections, nsMap, false);
            diagnostics.push(this.getDiagnosticArray(diagnosticResults));

            this.diagnosticCollection.set(textDocument.uri, diagnostics
                .reduce((prev, next) => prev.filter(dp => next.some(dn => dn.range.start.compareTo(dp.range.start) === 0))));
        }
        catch (err) {
            vscode.window.showErrorMessage(err.toString());
        }
        finally {
            const t1 = new Date().getTime();
            console.debug(`Linter took ${t1 - t0} milliseconds.`);
        }
    }

    private getDiagnosticArray(data: XmlDiagnosticData[]): vscode.Diagnostic[] {
        return data.map(r => {
            const position = new vscode.Position(r.line, r.column);
            const severity = (r.severity === "error") ? vscode.DiagnosticSeverity.Error :
                (r.severity === "warning") ? vscode.DiagnosticSeverity.Warning :
                    (r.severity === "info") ? vscode.DiagnosticSeverity.Information :
                        vscode.DiagnosticSeverity.Hint;
            return new vscode.Diagnostic(new vscode.Range(position, position), r.message, severity);
        });
    }
}