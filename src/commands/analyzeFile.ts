import * as vscode from 'vscode';

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

    const document = editor.document;
    const text = document.getText();
    
    // Perform your analysis on the text
    // For example, you can log the text to the console
    console.log('Analyzing file:', document.fileName);
    console.log('File content:', text);

    // Display a message to the user
    vscode.window.showInformationMessage(`Analyzed file: ${document.fileName}`);
};


// export AnalyzeFile, analyzeFile both
export { AnalyzeFile };