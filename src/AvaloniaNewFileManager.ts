import * as vscode from 'vscode';
import * as fs from 'fs';
import path from 'path';
import { NewFileUtils } from './NewFileUtils';
import { DotNetManagement } from './dotNetManagement';

export class AvaloniaNewFileManager {

    private context: vscode.ExtensionContext | undefined;

    public register(context: vscode.ExtensionContext): void{
         this.context = context;

        context.subscriptions.push(
            vscode.commands.registerCommand(
                "Avalonia.VSCode.Extension.CreateNewWindow",
                (args) => {
                    this.createNewWindow(args.path);
                })
            );
    }

    private createNewWindow(folderUri: string) {

        vscode.window
            .showInputBox({ 
                ignoreFocusOut: true, 
                prompt: "Please enter aXAML window name",
                value: "newWindow.axaml" })
            .then( async (newFileName) => {

                if (newFileName === '') {
                    return;
                }

                let fullFilePath = folderUri + path.sep + newFileName;

                if (fs.existsSync(fullFilePath)) {
                    vscode.window.showErrorMessage("File " + newFileName + " already exists");
                    return;
                }

                fullFilePath = NewFileUtils.correctFileExtension(fullFilePath, "axaml");

                var projectRootDirectory = NewFileUtils.getProjectRootDirectory(fullFilePath);
                if (projectRootDirectory === null)
                {
                    vscode.window.showErrorMessage("Unable to find project.json or *.csproj");
                    return;
                }
                
                var namespace = NewFileUtils.getProjectNamespace(projectRootDirectory, fullFilePath);

                await DotNetManagement.executeDotnetWithArgs([
                    "new",
                    "avalonia.window",
                    "-na",
                    namespace,
                    "-o",
                    folderUri,
                    "-n",
                    path.parse(fullFilePath).name
                ]);

                vscode.workspace
                    .openTextDocument(fullFilePath)
                    .then((doc) => { 
                        vscode.window.showTextDocument(doc);
                     });
            });
    }

}