import * as vscode from 'vscode';
import { XmlTagCollection } from './XmlTagCollection';

export class XmlSchemaProperties {
    schemaUri: vscode.Uri;
    parentSchemaUri: vscode.Uri;
    xsdContent: string;
    tagCollection: XmlTagCollection;
}