import * as vscode from 'vscode';
import PhpParserSingleton from '../phpParser';
import { Engine } from 'php-parser';
import * as fs from 'fs';

class AnalyzeFile extends vscode.Disposable
{
    // add constructor
    constructor(context: vscode.ExtensionContext) {
        super(() => {
            console.log('Dispose AnalyzeFile');
        });

        // Register the command
        context.subscriptions.push(vscode.commands.registerCommand('php-do-not-overwrite-variable.analyzeActivatedFile', () => analyzeFile(context)));
    }
}

const analyzeFile = async (context: vscode.ExtensionContext) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No active editor found.');
        return;
    }
    
    const parser = PhpParserSingleton.getInstance();
    const document = editor.document;
    const phpFile = fs.readFileSync(document.fileName) ;

    // Perform your analysis on the text using the parser
    const ast = parser.parseCode(phpFile.toString(), document.fileName);
    console.log('AST:', ast);

    // Display a message to the user
    vscode.window.showInformationMessage(`Analyzed file: ${document.fileName}`);
};


// export AnalyzeFile, analyzeFile both
export { AnalyzeFile };