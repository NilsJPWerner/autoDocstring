'use strict';
import * as vs from 'vscode';
import { AutoDocstring } from "./autodocstring";
import * as utils from "./utils";
import { type } from 'os';

export function activate(context: vs.ExtensionContext): void {
    context.subscriptions.push(
        vs.commands.registerCommand(
            'extension.generateDocstring', () => {
                let editor = vs.window.activeTextEditor;
                let autoDocstring = new AutoDocstring(editor);
                autoDocstring.generateDocstring(false);
             }
        )
    );

    let config = vs.workspace.getConfiguration("autoDocstring");

    if (config.get('generateDocstringOnEnter')) {
        context.subscriptions.push(
            vs.workspace.onDidChangeTextDocument(
                changeEvent => { activateOnEnter(changeEvent) }
            )
        );
    };
}

function activateOnEnter(changeEvent: vs.TextDocumentChangeEvent) {
    if (vs.window.activeTextEditor.document !== changeEvent.document) return;
    if (changeEvent.contentChanges.length < 1) return;
    if (changeEvent.contentChanges[0].rangeLength !== 0) return;

    if (changeEvent.contentChanges[0].text.replace(/ |\t|\r/g, "") === "\n") {
        processEnter(changeEvent);
    }
}

function processEnter(changeEvent: vs.TextDocumentChangeEvent) {
    let editor = vs.window.activeTextEditor;
    let range = getPrecedingRange(3, changeEvent);

    if (editor.document.getText(range) === '"""') {
        let autoDocstring = new AutoDocstring(editor, '"""');
        autoDocstring.generateDocstring(true);
    }
    else if (editor.document.getText(range) === "'''") {
        let autoDocstring = new AutoDocstring(editor, "'''")
        autoDocstring.generateDocstring(true)
    }
}

function getPrecedingRange(numberOfChars: number, changeEvent: vs.TextDocumentChangeEvent) {
    let position = changeEvent.contentChanges[0].range.end;
    let range = new vs.Range(position.translate(0, -1 * numberOfChars), position);
    return range
}

export function deactivate() {}
