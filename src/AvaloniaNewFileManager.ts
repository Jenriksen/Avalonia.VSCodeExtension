import * as vscode from 'vscode';

export class AvaloniaNewFileManager {

    private context: vscode.ExtensionContext | undefined;

    public register(context: vscode.ExtensionContext): void{
         this.context = context;

         context.subscriptions.push(
             vscode.commands.registerCommand(
                 "Avalonia.VSCode.Extension.CreateNewWindow",
                 this.createNewWindow
             )
         );
    }

    private createNewWindow() {
        
    }

}