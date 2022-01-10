import * as vscode from 'vscode';
import { CreateProjectCommand } from './CreateProjectCommand';

export class AvaloniaProjectProvider implements vscode.TreeDataProvider<vscode.TreeItem> 
{
    onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | null | undefined> | undefined;

    refresh(): void  
    {
        console.log("refreshing...");
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> 
    {
        return element;
    }
    
    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> 
    {
        if (element ===  undefined)
        {
            return this.createAvaloniaProjectManagementCommands();
        }
    }

    private createAvaloniaProjectManagementCommands(): CreateProjectCommand[]
    {
        var commands: CreateProjectCommand[] = [];

        commands.push(new CreateProjectCommand(
            "Avalonia .NET Core MVVM App",
            "",
            vscode.TreeItemCollapsibleState.None,
            {
                command: "Avalonia.VSCode.Extension.CreateNewMvvmApp",
                title: "",
                arguments: []
            },
            "logo.svg"
        ));

        commands.push(new CreateProjectCommand(
            "Avalonia .NET Core App",
            "",
            vscode.TreeItemCollapsibleState.None,
            {
                command: "createAvaloniaApp",
                title: "",
                arguments: []
            },
            "logo.svg"
        ));

        commands.push(new CreateProjectCommand(
            "Avalonia Cross Platform Application",
            "",
            vscode.TreeItemCollapsibleState.None,
            {
                command: "createAvaloniaXplat",
                title: "",
                arguments: []
            },
            "logo.svg"
        ));

        return commands;
    }

}