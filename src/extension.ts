"use strict";
import * as vs from "vscode";
import { AutoDocstring } from "./autodocstring";

export function activate(context: vs.ExtensionContext): void {
    context.subscriptions.push(
        vs.commands.registerCommand(
            "extension.generateDocstring", () => {
                const editor = vs.window.activeTextEditor;
                const autoDocstring = new AutoDocstring(editor);
                autoDocstring.generateDocstring(false);
             },
        ),
    );

    const config = vs.workspace.getConfiguration("autoDocstring");

    if (config.get("generateDocstringOnEnter")) {
        context.subscriptions.push(
            vs.workspace.onDidChangeTextDocument(
                (changeEvent) => { activateOnEnter(changeEvent); },
            ),
        );
    }
}

function activateOnEnter(changeEvent: vs.TextDocumentChangeEvent) {
    if (vs.window.activeTextEditor.document !== changeEvent.document) { return; }
    if (changeEvent.contentChanges.length < 1) { return; }
    if (changeEvent.contentChanges[0].rangeLength !== 0) { return; }

    if (changeEvent.contentChanges[0].text.replace(/ |\t|\r/g, "") === "\n") {
        processEnter(changeEvent);
    }
}

function processEnter(changeEvent: vs.TextDocumentChangeEvent) {
    const editor = vs.window.activeTextEditor;
    const range = getPrecedingRange(3, changeEvent);
    const quoteStyle = vs.workspace.getConfiguration("autoDocstring").config.get("quoteStyle").toString();

    if (editor.document.getText(range) === quoteStyle) {
        const autoDocstring = new AutoDocstring(editor);
        autoDocstring.generateDocstring(true);
    }
}

function getPrecedingRange(numberOfChars: number, changeEvent: vs.TextDocumentChangeEvent) {
    const position = changeEvent.contentChanges[0].range.end;
    const range = new vs.Range(position.translate(0, -1 * numberOfChars), position);
    return range;
}

export function deactivate() { return; }
