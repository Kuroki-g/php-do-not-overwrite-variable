/**
 * Copyright (c) 2025 G-kuroki. All rights reserved.
 * Modified part is licensed under GPL-3.0 License.
 * See LICENSE in the project root for license information.
 * Original part is licensed under MIT License. See README.md in the project root for license information.
 */
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License section in README.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	type CompletionItem,
	CompletionItemKind,
	type Diagnostic,
	DiagnosticSeverity,
	DidChangeConfigurationNotification,
	type DocumentDiagnosticReport,
	DocumentDiagnosticReportKind,
	type InitializeParams,
	type InitializeResult,
	ProposedFeatures,
	type TextDocumentPositionParams,
	TextDocumentSyncKind,
	TextDocuments,
	createConnection,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { GlobalState } from "./GlobalState";
import { type ExtensionSettings, defaultSettings } from "./types";
import { validatePHPDocument } from "./validatePHPDocument";
import { ConnectionSingleton } from "./Connection";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.

// Create a simple text document manager.
const documents = new TextDocuments(TextDocument);

const connection = ConnectionSingleton.getInstance();

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;
	const globalState = GlobalState.getInstance();

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	globalState.hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	globalState.hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	globalState.hasDiagnosticRelatedInformationCapability =
		!!capabilities.textDocument?.publishDiagnostics?.relatedInformation;

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true,
			},
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false,
			},
		},
	};
	if (GlobalState.getInstance().hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
			},
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (GlobalState.getInstance().hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined,
		);
	}
	if (GlobalState.getInstance().hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			connection.console.log("Workspace folder change event received.");
		});
	}
});

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
let globalSettings: ExtensionSettings = defaultSettings;

connection.onDidChangeConfiguration((change) => {
	if (GlobalState.getInstance().hasConfigurationCapability) {
		// Reset all cached document settings
		GlobalState.getInstance().documentSettings.clear();
	} else {
		globalSettings =
			change.settings.phpDoNotOverwriteVariable || defaultSettings;
	}
	// Refresh the diagnostics since the `maxNumberOfProblems` could have changed.
	// We could optimize things here and re-fetch the setting first can compare it
	// to the existing setting, but this is out of scope for this example.
	connection.languages.diagnostics.refresh();
});

// Only keep settings for open documents
documents.onDidClose((e) => {
	GlobalState.getInstance().documentSettings.delete(e.document.uri);
});

connection.languages.diagnostics.on(async (params) => {
	console.debug(`start diagnostics: ${params.textDocument.uri}`);
	const document = documents.get(params.textDocument.uri);
	const report = {
		kind: DocumentDiagnosticReportKind.Full,
		items: [] as Diagnostic[],
	} satisfies DocumentDiagnosticReport;

	if (document !== undefined) {
		const items = await validatePHPDocument(document);
		report.items.push(...items);
	}
	console.debug(`end diagnostics: ${params.textDocument.uri}`);
	return report satisfies DocumentDiagnosticReport;
});

// An event that fires when a text document managed by this manager has been opened or the content changes.
// documents.onDidChangeContent((change) => {
// 	console.debug(`onDidChangeContent: ${change.document.uri}`);
// 	validateTxtDocument(change.document);
// });

// async function validateTxtDocument(
// 	textDocument: TextDocument,
// ): Promise<Diagnostic[]> {
// 	// In this simple example we get the settings for every validate run.
// 	const settings = await GlobalState.getDocumentSettings(textDocument.uri);

// 	// The validator creates diagnostics for all uppercase words length 2 and more
// 	const text = textDocument.getText();
// 	const pattern = /\b[A-Z]{2,}\b/g;
// 	let m: RegExpExecArray | null;

// 	let problems = 0;
// 	const diagnostics: Diagnostic[] = [];
// 	// biome-ignore lint/suspicious/noAssignInExpressions: TODO: 現時点で説明を確認していないためそのうち修正する。
// 	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
// 		problems++;
// 		const diagnostic: Diagnostic = {
// 			severity: DiagnosticSeverity.Warning,
// 			range: {
// 				start: textDocument.positionAt(m.index),
// 				end: textDocument.positionAt(m.index + m[0].length),
// 			},
// 			message: `${m[0]} is all uppercase.`,
// 			source: "ex",
// 		};
// 		if (GlobalState.getInstance().hasDiagnosticRelatedInformationCapability) {
// 			diagnostic.relatedInformation = [
// 				{
// 					location: {
// 						uri: textDocument.uri,
// 						range: Object.assign({}, diagnostic.range),
// 					},
// 					message: "Spelling matters",
// 				},
// 				{
// 					location: {
// 						uri: textDocument.uri,
// 						range: Object.assign({}, diagnostic.range),
// 					},
// 					message: "Particularly for names",
// 				},
// 			];
// 		}
// 		diagnostics.push(diagnostic);
// 	}
// 	return diagnostics;
// }

connection.onDidChangeWatchedFiles((_change) => {
	// Monitored files have change in VSCode
	connection.console.log("We received a file change event");
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		return [
			{
				label: "TypeScript",
				kind: CompletionItemKind.Text,
				data: 1,
			},
			{
				label: "JavaScript",
				kind: CompletionItemKind.Text,
				data: 2,
			},
		];
	},
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === 1) {
		item.detail = "TypeScript details";
		item.documentation = "TypeScript documentation";
	} else if (item.data === 2) {
		item.detail = "JavaScript details";
		item.documentation = "JavaScript documentation";
	}
	return item;
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
