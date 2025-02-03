import type { TextDocument } from "vscode-languageserver-textdocument";
import { GlobalState } from "./GlobalState";
import { Range, type Diagnostic } from "vscode-languageserver/node";
import {
	type Assign,
	type Class,
	Engine,
	type ExpressionStatement,
	type Method,
	type Program,
	type Variable,
} from "php-parser";

const validatePHPDocument = async (textDocument: TextDocument) => {
	// TODO: add settings, but this doesn't seem to be used now
	const settings = await GlobalState.getDocumentSettings(textDocument.uri);

	// const parser = PhpParserSingleton.getInstance();
	const parser = new Engine({
		parser: {
			debug: true,
			locations: false,
			extractDoc: true,
			suppressErrors: false,
		},
		ast: {
			withPositions: true,
			withSource: true,
		},
		lexer: {
			all_tokens: true,
			comment_tokens: true,
			mode_eval: false,
			asp_tags: false,
			short_tags: false,
		},
	});

	const text = textDocument.getText();
	const ast = parser.parseCode(text, textDocument.uri);

	const diagnostics = extractDiagnostics(ast);

	return diagnostics;
};

/**
 * parse the AST and extract diagnostics
 * @param ast
 */
const extractDiagnostics = (ast: Program) => {
	// analyze class
	const diagnostics: Diagnostic[] = [];
	for (const classNode of ast.children) {
		switch (classNode.kind) {
			case "class":
				diagnostics.push(...extractClassDiagnostics(classNode as Class));
				break;
			default:
				break;
		}
	}

	return diagnostics;
};

const extractClassDiagnostics = (classNode: Class) => {
	const diagnostics: Diagnostic[] = [];
	for (const declaration of classNode.body) {
		switch (declaration.kind) {
			case "method":
				diagnostics.push(...extractMethodDiagnostics(declaration as Method));
				break;
			default:
				break;
		}
	}

	return diagnostics;
};

const extractMethodDiagnostics = (methodNode: Method) => {
	const diagnostics: Diagnostic[] = [];
	const currentAssignments: Map<string, Assign> = new Map();
	const hasOverwrittenAssignments: Map<string, Assign[]> = new Map();
	for (const statement of methodNode.body?.children || []) {
		switch (statement.kind) {
			case "expressionstatement": {
				const exp = statement as ExpressionStatement;
				if (exp.expression.kind === "assign") {
					const assign = exp.expression as Assign;
					if (assign.left.kind === "variable") {
						const variable = assign.left as Variable;
						const variableName = variable.name.toString();
						if (currentAssignments.has(variableName)) {
							const hasOverwritten =
								hasOverwrittenAssignments.get(variableName);
							// merge current and new one
							if (hasOverwritten) {
								hasOverwritten.push(assign);
							} else {
								hasOverwrittenAssignments.set(variableName, [
									currentAssignments.get(variableName) as Assign,
									assign,
								]);
							}
						} else {
							currentAssignments.set(variableName, assign);
						}
					}
				}
				break;
			}
			default:
				break;
		}
	}

	if (hasOverwrittenAssignments.size > 0) {
		for (const [variableName, assigns] of hasOverwrittenAssignments) {
			for (const assign of assigns) {
				// define new diagnostic
				const diagnostic: Diagnostic = {
					range: Range.create(
						{
							line: (assign.loc?.start.line ?? 0) - 1,
							character: (assign.loc?.start.column ?? 0) - 1,
						},
						{
							line: (assign.loc?.end.line ?? 0) - 1,
							character: (assign.loc?.end.column ?? 0) - 1,
						},
					),
					severity: 1,
					message: `Variable ${variableName} is overwritten`,
				};
				diagnostics.push(diagnostic);
			}
		}
	}

	return diagnostics;
};

export { validatePHPDocument };
