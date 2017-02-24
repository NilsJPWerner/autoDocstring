'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AutoDocstring } from "./autodocstring";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('autoDocstring has been activated');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.generateDocstring', () => {
        // The code you place here will be executed every time your command is executed

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let document = editor.document;
        let position = editor.selection.active;

        let autoDocstring = new AutoDocstring;
        let docstring: string = autoDocstring.getDocstring(document, position)
        console.log('Docstring generated: ' + docstring);

        let snippet = new vscode.SnippetString(docstring)
        editor.insertSnippet(snippet, position)
        console.log('Docstring inserted');

        // vscode.window.activeTextEditor.insertSnippet()
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

