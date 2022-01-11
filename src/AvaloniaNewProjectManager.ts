import * as vscode from 'vscode';
import { CreateNewAppPanel } from './CreateNewAppPanel';
import { CreateNewCrossAppPanel } from './CreateNewCrossAppPanel';
import { CreateNewMvvmAppPanel } from './CreateNewMvvmAppPanel';
import { ExecuteOnTerminal } from './ExecuteOnTerminal';

export class AvaloniaNewProjectManager {
    public context: vscode.ExtensionContext | undefined;

    private static instance: AvaloniaNewProjectManager;

    public static getInstance() : AvaloniaNewProjectManager  {
        if (!AvaloniaNewProjectManager.instance) {
            AvaloniaNewProjectManager.instance = new AvaloniaNewProjectManager();
        }

        return AvaloniaNewProjectManager.instance;
    }

    public static register(context: vscode.ExtensionContext): void {
        var current = this.getInstance();
        current.context = context;

        context.subscriptions.push(
            vscode.commands.registerCommand(
                "Avalonia.VSCode.Extension.CreateNewMvvmApp", 
                () => {
                    CreateNewMvvmAppPanel.createOrShow(context.extensionUri);

                    CreateNewMvvmAppPanel._panel.webview.postMessage({
                        type: "setHomeFolder",
                        value: process.env.HOME
                    });
                }
            )
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                "Avalonia.VSCode.Extension.CreateNewAvaloniaApp", 
                () => {
                    CreateNewAppPanel.createOrShow(context.extensionUri);

                    CreateNewAppPanel._panel.webview.postMessage({
                        type: "setHomeFolder",
                        value: process.env.HOME
                    });
                }
            )
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                "Avalonia.VSCode.Extension.CreateNewCrossPlatformApp", 
                () => {
                    CreateNewCrossAppPanel.createOrShow(context.extensionUri);

                    CreateNewCrossAppPanel._panel.webview.postMessage({
                        type: "setHomeFolder",
                        value: process.env.HOME
                    });
                }
            )
        );
    }

    public async createMvvmApp(
        projectName: string, 
        projectPath: string, 
        solutionName: string) {

        this.createGenericApp(
            "Creating Avalonia MVVM Application", 
            projectName,
            projectPath,
            "avalonia.mvvm");
    }

    public async createApp(
        projectName: string, 
        projectPath: string, 
        solutionName: string) {

        this.createGenericApp(
            "Creating Avalonia Application", 
            projectName,
            projectPath,
            "avalonia.app");
    }

    public async createCrossApp(
        projectName: string, 
        projectPath: string, 
        solutionName: string) {

        this.createGenericApp(
            "Creating Avalonia Cross Platform Application", 
            projectName,
            projectPath,
            "avalonia.xplat");
    }

    private async installAvaloniaTemplates() {
        return await this.executeDotnetWithArgs(
            "Install Avalonia Templates",
            ["new", "--install", "Avalonia.Templates" ]);
    }

    private async createGenericApp(
        initialInformationMessage: string, 
        projectName: string,
        projectPath: string, 
        avaloniaTemplateName: string) {

        var path = require('path');
        vscode.window.showInformationMessage(initialInformationMessage);

        await this.installAvaloniaTemplates();

        var combinedProjectPath = path.join( projectPath, projectName);
        await this.executeDotnetWithArgs(
            "",
            ["new", avaloniaTemplateName, "-o", combinedProjectPath]);

        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(combinedProjectPath), false);
    }

    private async executeDotnetWithArgs(actionDescription: string, args: string[]) {
        var dotnetPath = await ExecuteOnTerminal.getDotnetPath();
        if (dotnetPath === undefined)
        {
            vscode.window.showErrorMessage("Cannot create Avalonia MVVM App. Plase install 'dotnet' first.");
            return false;
        }

        await ExecuteOnTerminal.executeCommand(
            dotnetPath, 
            args);

        return true;
    }
}