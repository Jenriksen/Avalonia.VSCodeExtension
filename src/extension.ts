import * as vscode from 'vscode';
import { AvaloniaNewProjectManager } from './AvaloniaNewProjectManager';
import { AvaloniaProjectProvider } from './AvaloniaProjectProvider';

export function activate(context: vscode.ExtensionContext) 
{
	AvaloniaNewProjectManager.register(context);

	const projectManagementCommands = new AvaloniaProjectProvider();
	vscode.window.registerTreeDataProvider("avalonia-sidebar", projectManagementCommands);
}

export function deactivate() {}
