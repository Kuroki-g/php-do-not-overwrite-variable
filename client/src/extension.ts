// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import  { AnalyzeFile } from './commands/analyzeFile';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions
} from 'vscode-languageclient/node';
import path from 'path';


let client: LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "php-do-not-overwrite-variable" is now active!');

    const disposable = new AnalyzeFile(context);

	context.subscriptions.push(disposable);

    const serverOptions = {} as ServerOptions;
    const clientOptions = {} as  LanguageClientOptions
    client = new LanguageClient(
        'languageServerExample',
        'Language Server Example',
        serverOptions,
        clientOptions
    );
    
    // Start the client. This will also launch the server
    client.start();    
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
