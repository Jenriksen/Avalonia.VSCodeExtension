import * as vscode from 'vscode';
import { AvaloniaProjectProvider } from './AvaloniaProjectProvider';
import { CreateNewMvvmAppPanel } from './CreateNewMvvmAppPanel';

export function activate(context: vscode.ExtensionContext) 
{
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"avaloniaxamlcompletion.CreateNewMvvmApp", 
			() => {
				CreateNewMvvmAppPanel.createOrShow(context.extensionUri);
			}
		)
	);

	const projectManagementCommands = new AvaloniaProjectProvider();
	vscode.window.registerTreeDataProvider("avalonia-sidebar", projectManagementCommands);
}

export function deactivate() {}
