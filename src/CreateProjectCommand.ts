import * as vscode from 'vscode';

export class CreateProjectCommand extends vscode.TreeItem
{
    constructor(
        public readonly label: string,
        public readonly desc: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command: vscode.Command,
        public  icon: string)
    {
        super(label);

        this.tooltip = `${this.label}`;
        this.description = `${this.desc}`;
    }
}