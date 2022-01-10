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

        vscode.window.showInformationMessage("Creating Avalonia MVVM App");

        await this.installAvaloniaTemplates();

        var combinedProjectPath = this.pathJoin([projectPath, projectName], "/");
        await this.executeDotnetWithArgs(
            "Create MVVM App",
            ["new", "avalonia.mvvm", "-o", combinedProjectPath]);

        vscode.window.showInformationMessage("Avalonia MVVM App " + projectName + " created successfully");
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(combinedProjectPath), false);
    }

    public async createApp(
        projectName: string, 
        projectPath: string, 
        solutionName: string) {

        vscode.window.showInformationMessage("Creating Avalonia App");

        await this.installAvaloniaTemplates();

        var combinedProjectPath = this.pathJoin([projectPath, projectName], "/");
        await this.executeDotnetWithArgs(
            "Create App",
            ["new", "avalonia.app", "-o", combinedProjectPath]);

        vscode.window.showInformationMessage("Avalonia App " + projectName + " created successfully");
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(combinedProjectPath), false);
    }

    public async createCrossApp(
        projectName: string, 
        projectPath: string, 
        solutionName: string) {

        vscode.window.showInformationMessage("Creating Avalonia Cross Platform Application");

        await this.installAvaloniaTemplates();

        var combinedProjectPath = this.pathJoin([projectPath, projectName], "/");
        await this.executeDotnetWithArgs(
            "Create App",
            ["new", "avalonia.xplat", "-o", combinedProjectPath]);

        vscode.window.showInformationMessage("Avalonia Cross Platform Applçication " + projectName + " created successfully");
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(combinedProjectPath), false);
    }

    private async installAvaloniaTemplates() {
        return await this.executeDotnetWithArgs(
            "Install Avalonia Templates",
            ["new", "--install", "Avalonia.Templates" ]);
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

    private pathJoin(parts: string[], sep: string): string {
        const separator = sep || '/';
        parts = parts.map((part, index)=>{
            if (index) {
                part = part.replace(new RegExp('^' + separator), '');
            }
            if (index !== parts.length - 1) {
                part = part.replace(new RegExp(separator + '$'), '');
            }
            return part;
        })
        return parts.join(separator);
     }
}