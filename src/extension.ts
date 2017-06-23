'use strict';
import * as vs from 'vscode';
import { AutoDocstring } from "./autodocstring";

export function activate(context: vs.ExtensionContext): void {
    console.log('autoDocstring has been activated');

    context.subscriptions.push(vs.commands.registerCommand('extension.generateDocstring', () => {
        generateDocstring();
    }));

    if (vs.workspace.getConfiguration("autoDocstring").get('generateDocstringOnEnter')) {
        context.subscriptions.push(vs.workspace.onDidChangeTextDocument(change_event => {

            const editor = vs.window.activeTextEditor;
            if (editor.document !== change_event.document) return;

            if (change_event.contentChanges[0].text.replace(/ |\t|\r/g, "") === "\n"
                && change_event.contentChanges[0].rangeLength === 0) {

                    const position: vs.Position = change_event.contentChanges[0].range.end;
                    const range: vs.Range = new vs.Range(position.translate(0, -3), position);

                    if (editor.document.getText(range) === '"""') {
                        // Delete the opening quotes and the new line
                        deleteRange(range);
                        deleteLine(position.line + 1);
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

function deleteLine(line_num: number) {
    const editor = vs.window.activeTextEditor;
    const line = editor.document.lineAt(line_num);
    const ws_edit = new vs.WorkspaceEdit();
    ws_edit.delete(editor.document.uri, line.rangeIncludingLineBreak)
    vs.workspace.applyEdit(ws_edit);
}

function generateDocstring() {
    var editor = vs.window.activeTextEditor;

    let document = editor.document;
    let position = editor.selection.active;

    let auto_docstring = new AutoDocstring();
    let docstring_snippet: vs.SnippetString = auto_docstring.getDocstring(document, position);


    editor.insertSnippet(docstring_snippet, position)
    console.log('Docstring inserted');
}
