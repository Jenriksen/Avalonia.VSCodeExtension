import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';
import * as AxamlCompletion from './Axaml/AxamlCompletion';
import { AvaloniaNewProjectManager } from './AvaloniaNewProjectManager';
import { AvaloniaProjectProvider } from './AvaloniaProjectProvider';

import {
    LanguageClient,
    LanguageClientOptions,
	SettingMonitor,
    ServerOptions,
    TransportKind,
	InitializeParams,
    StreamInfo,
    createServerPipeTransport,
} from "vscode-languageclient/node";
import { AvaloniaNewFileManager } from './AvaloniaNewFileManager';
import path from 'path';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) 
{
	// Activate the Code-Completion
	// AxamlCompletion.xamlActivate(context);

	const newFileManagement = new AvaloniaNewFileManager();
	newFileManagement.register(context);

	var extension = vscode.extensions.getExtension("PauloAboimPinto.avalonia.vscode.extension");

	const dllPath = 
		vscode.extensions.getExtension("PauloAboimPinto.avalonia.vscode.extension").extensionPath + 
		path.sep + 
		"Avalonia.AXAML.LanguageServer" +
		path.sep + 
		"Avalonia.AXAML.LanguageServer" +
		path.sep + 
		"bin" +
		path.sep + 
		"Debug" +
		path.sep + 
		"net6.0" +
		path.sep + 
		"Avalonia.AXAML.LanguageServer.dll";

	console.log("--> " + dllPath);

	let serverOptions: ServerOptions = {
		run: {
			command: "dotnet",
			args: [dllPath],
			transport: TransportKind.pipe
		},
		debug: {
			command: "dotnet",
			args: [dllPath],
			transport: TransportKind.pipe,
			runtime: ""
		}
	};

	let clientOptions: LanguageClientOptions = {
		documentSelector: [
			{
				pattern: "**/*.xaml",
			},
			{
				pattern: "**/*.axaml",
			},
			{
				pattern: "**/*.csproj",
			},
		],
		  synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.axaml')
		  }
	};

	client = new LanguageClient(
		"AvaloniaAXAML",
		"Avalonia aXAML Language Server",
		serverOptions,
		clientOptions
	);

	let disposable = client.start();
	context.subscriptions.push(disposable);

	AvaloniaNewProjectManager.register(context);

	const projectManagementCommands = new AvaloniaProjectProvider();
	vscode.window.registerTreeDataProvider("avalonia-sidebar", projectManagementCommands);
}

export function deactivate() {}
