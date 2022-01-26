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
                    this.createAxamlWithNamespace(
                        args.path, 
                        "Please enter aXAML window name",
                        "newWindow.axaml",
                        "avalonia.window");
                })
            );

            context.subscriptions.push(
                vscode.commands.registerCommand(
                    "Avalonia.VSCode.Extension.CreateUserControl",
                    (args) => {
                        this.createAxamlWithNamespace(
                            args.path, 
                            "Please enter aXAML user control name",
                            "newUserControl.axaml",
                            "avalonia.usercontrol");
                    })
                );

            context.subscriptions.push(
                vscode.commands.registerCommand(
                    "Avalonia.VSCode.Extension.CreateStyleList",
                    (args) => {
                        this.createAxaml(
                            args.path, 
                            "Please enter aXAML styles file",
                            "newStyle.axaml",
                            "avalonia.styles");
                    })
                );
            
            context.subscriptions.push(
                vscode.commands.registerCommand(
                    "Avalonia.VSCode.Extension.CreateResourceDictionary",
                    (args) => {
                        this.createAxaml(
                            args.path, 
                            "Please enter aXAML resource dictionary file",
                            "newResources.axaml",
                            "avalonia.resource");
                    })
                );
    }

    private createAxamlWithNamespace(
        folderUri: string,
        prompt: string,
        defaultFileName: string,
        avaloniaTemplate: string) {

        vscode.window
            .showInputBox({ 
                ignoreFocusOut: true, 
                prompt: prompt,
                value: defaultFileName })
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
                    avaloniaTemplate,
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

    private createAxaml(
        folderUri: string,
        prompt: string,
        defaultFileName: string,
        avaloniaTemplate: string) {

        vscode.window
            .showInputBox({ 
                ignoreFocusOut: true, 
                prompt: prompt,
                value: defaultFileName })
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

                await DotNetManagement.executeDotnetWithArgs([
                    "new",
                    avaloniaTemplate,
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