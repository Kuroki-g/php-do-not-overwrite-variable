// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, ExtensionContext, window } from 'vscode';
import  { AnalyzeFile } from './commands/analyzeFile';
import {
    DocumentSelector,
    LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import path from 'path';

let client: LanguageClient | undefined = undefined;
const outputChannel = window.createOutputChannel("PHP No Overwrite Variable");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	console.debug('Activating php-do-not-overwrite-variable...');
    outputChannel.appendLine('Activating php-do-not-overwrite-variable...');

	const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const disposable = new AnalyzeFile(context);

	context.subscriptions.push(disposable);

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		}
	};

	// Options to control the language client
    const documentSelector: DocumentSelector = [
        { scheme: 'file', language: "php"}
    ];
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: documentSelector,
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'phpDoNotOverwriteVariable',
		'PHP No Overwrite Variable',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

    console.debug('Activating php-do-not-overwrite-variable done.');
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
