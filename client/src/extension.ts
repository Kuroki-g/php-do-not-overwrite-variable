import path from "node:path";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { type ExtensionContext, window, workspace } from "vscode";
import {
  type DocumentSelector,
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";
import { AnalyzeFile } from "./commands/analyzeFile";

let client: LanguageClient | undefined = undefined;
const outputChannel = window.createOutputChannel("PHP No Overwrite Variable");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  outputChannel.appendLine("Activating php-do-not-overwrite-variable...");

  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "server.js"),
  );
  const disposable = new AnalyzeFile(context);

  context.subscriptions.push(disposable);

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  };

  // Options to control the language client
  const documentSelector: DocumentSelector = [
    { scheme: "file", language: "php" },
  ];
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: documentSelector,
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  client = new LanguageClient(
    "phpDoNotOverwriteVariable",
    "PHP No Overwrite Variable",
    serverOptions,
    clientOptions,
  );

  // Start the client. This will also launch the server
  client.start();

  outputChannel.appendLine("Activating php-do-not-overwrite-variable done.");
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
