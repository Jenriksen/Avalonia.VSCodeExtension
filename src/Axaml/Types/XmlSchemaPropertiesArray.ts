import * as vscode from 'vscode';
import { XmlSchemaProperties } from "./XmlSchemaProperties";

export class XmlSchemaPropertiesArray extends Array<XmlSchemaProperties> {
    filterUris(uris: vscode.Uri[]): Array<XmlSchemaProperties> {
        return this.filter(e => uris
            .find(u => u.toString() === e.parentSchemaUri.toString()) !== undefined);
    }
}