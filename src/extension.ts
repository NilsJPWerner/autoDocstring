'use strict';
import * as vscode from 'vscode';
import { AutoDocstring } from "./autodocstring";

export function activate(context: vscode.ExtensionContext): void {
    console.log('autoDocstring has been activated');

    context.subscriptions.push(vscode.commands.registerCommand('extension.generateDocstring', () => {
        generate_docstring();
    }));

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(change_event => {
        if (!vscode.workspace.getConfiguration("autoDocstring").get('generateDocstringOnEnter')) return;
        // languaage is unsupported

        const editor = vscode.window.activeTextEditor;
        if (editor.document !== change_event.document) {
            return;
        }

        if (change_event.contentChanges[0].text.indexOf("\n") > -1) {
            const position: vscode.Position = change_event.contentChanges[0].range.start;
            const range: vscode.Range = new vscode.Range(position.translate(0, -3), position);
            if (editor.document.getText(range) === '"""') {
                generate_docstring();
            }
        }
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function remove_docstring_opener() {

}

function generate_docstring() {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    vscode.workspace.onDidChangeTextDocument

    let document = editor.document;
    let position = editor.selection.active;

    let auto_docstring = new AutoDocstring();
    let docstring_snippet: vscode.SnippetString = auto_docstring.getDocstring(document, position);


    editor.insertSnippet(docstring_snippet, position)
    console.log('Docstring inserted');
}
