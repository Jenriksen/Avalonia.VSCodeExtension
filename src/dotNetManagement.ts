import * as vscode from 'vscode';
import { ExecuteOnTerminal } from "./ExecuteOnTerminal";

export class DotNetManagement {
    public static async executeDotnetWithArgs(args: string[]) {
        var dotnetPath = await ExecuteOnTerminal.getDotnetPath();
        if (dotnetPath === undefined)
        {
            vscode.window.showErrorMessage("'dotnet' command not installed in the system. Plase install 'dotnet' first.");
            return false;
        }
    
        await ExecuteOnTerminal.executeCommand(
            dotnetPath, 
            args);
    
        return true;
    }
}