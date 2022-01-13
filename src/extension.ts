import * as vscode from 'vscode';
import * as AxamlCompletion from './Axaml/AxamlCompletion';
import { AvaloniaNewProjectManager } from './AvaloniaNewProjectManager';
import { AvaloniaProjectProvider } from './AvaloniaProjectProvider';

export function activate(context: vscode.ExtensionContext) 
{
	// Activate the Code-Completion
	AxamlCompletion.xamlActivate(context);

	AvaloniaNewProjectManager.register(context);

	const projectManagementCommands = new AvaloniaProjectProvider();
	vscode.window.registerTreeDataProvider("avalonia-sidebar", projectManagementCommands);
}

export function deactivate() {}
