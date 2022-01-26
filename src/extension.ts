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

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) 
{
	// Activate the Code-Completion
	// AxamlCompletion.xamlActivate(context);

	let serverOptions: ServerOptions = {
		run: {
			command: "dotnet",
			args: ["/home/esqueleto/myWork/Avalonia.VSCodeExtension/Avalonia.AXAML.LanguageServer/Avalonia.AXAML.LanguageServer/bin/Debug/net6.0/Avalonia.AXAML.LanguageServer.dll"],
			transport: TransportKind.pipe
		},
		debug: {
			command: "dotnet",
			args: ["/home/esqueleto/myWork/Avalonia.VSCodeExtension/Avalonia.AXAML.LanguageServer/Avalonia.AXAML.LanguageServer/bin/Debug/net6.0/Avalonia.AXAML.LanguageServer.dll"],
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

	const newFileManagement = new AvaloniaNewFileManager();
	newFileManagement.register(context);
}

export function deactivate() {}
