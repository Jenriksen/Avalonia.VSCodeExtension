import * as vscode from 'vscode';
import { CreateNewMvvmAppPanel } from './CreateNewMvvmAppPanel';

export class AvaloniaNewProjectManager {
    public context: vscode.ExtensionContext | undefined;

    public static Register(context: vscode.ExtensionContext): void {
        var newProjectManager = new AvaloniaNewProjectManager();
        newProjectManager.context = context;

        context.subscriptions.push(
            vscode.commands.registerCommand(
                "Avalonia.VSCode.Extension.CreateNewMvvmApp", 
                () => {
                    CreateNewMvvmAppPanel.createOrShow(context.extensionUri);
                }
            )
        );
    }
}