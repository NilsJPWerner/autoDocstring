'use strict';
import * as vs from 'vscode';
import { AutoDocstring } from "./autodocstring";

let auto_docstring: AutoDocstring;

export function activate(context: vs.ExtensionContext): void {
    console.log('autoDocstring has been activated');

    context.subscriptions.push(vs.commands.registerCommand('extension.generateDocstring', () => {
        generateDocstring();
    }));

    if (vs.workspace.getConfiguration("autoDocstring").get('generateDocstringOnEnter')) {
        context.subscriptions.push(vs.workspace.onDidChangeTextDocument(change_event => {

            const editor = vs.window.activeTextEditor;
            if (editor.document !== change_event.document) return;

            if (change_event.contentChanges[0].text.indexOf("\n") > -1) {
                const position: vs.Position = change_event.contentChanges[0].range.start;
                const range: vs.Range = new vs.Range(position, position.translate(0, -3));

                if (editor.document.getText(range) === '"""') {
                    deleteRange(range);
                    console.log("String: " + encodeURI(change_event.contentChanges[0].text));


                    deleteRange(change_event.contentChanges[0].range);
                    generateDocstring();
                }
            }
        }));
    }
}

export function deactivate() {
}

function deleteRange(range: vs.Range) {
    const editor = vs.window.activeTextEditor;
    const ws_edit = new vs.WorkspaceEdit();
    ws_edit.delete(editor.document.uri, range)
    vs.workspace.applyEdit(ws_edit);
}

function generateDocstring() {
    var editor = vs.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    let document = editor.document;
    let position = editor.selection.active;

    if (!auto_docstring) {
        auto_docstring = new AutoDocstring();
    }
    let docstring_snippet: vs.SnippetString = auto_docstring.getDocstring(document, position);


    editor.insertSnippet(docstring_snippet, position)
    console.log('Docstring inserted');
}
