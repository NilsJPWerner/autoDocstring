"use strict";
import * as vs from "vscode";
import { AutoDocstring } from "./autodocstring";

export function activate(context: vs.ExtensionContext): void {
    context.subscriptions.push(
        vs.commands.registerCommand(
            "extension.generateDocstring", () => {
                activateFromCommand();
             },
        ),
    );

    const config = vs.workspace.getConfiguration("autoDocstring");

    if (config.get("generateDocstringOnEnter")) {
        context.subscriptions.push(
            vs.workspace.onDidChangeTextDocument(
                (changeEvent) => { activateFromEnter(changeEvent); },
            ),
        );
    }
}

function activateFromCommand() {
    const editor = vs.window.activeTextEditor;
    const autoDocstring = new AutoDocstring(editor);

    autoDocstring.generateDocstring();
}

function activateFromEnter(changeEvent: vs.TextDocumentChangeEvent) {
    // If the edited document is not the same as the active document return
    if (vs.window.activeTextEditor.document !== changeEvent.document) {
        return;
    } else if (!changeWasNewLineCharacter(changeEvent)) {
        return;
    } else if (!changeFollowsRequiredChars(changeEvent)) {
        return;
    }

    const editor = vs.window.activeTextEditor;
    const autoDocstring = new AutoDocstring(editor);
    autoDocstring.generateDocstringFromEnter();
}

function changeWasNewLineCharacter(changeEvent: vs.TextDocumentChangeEvent): boolean {
    if (changeEvent.contentChanges.length !== 1) {
        return false;
    }

    const contentChangeText = changeEvent.contentChanges[0].text;
    const strippedText = contentChangeText.replace(/ |\t|\r/g, "");

    return strippedText === "\n";
}

function changeFollowsRequiredChars(changeEvent: vs.TextDocumentChangeEvent): boolean {
    const precedingText = getPrecedingText(3, changeEvent);
    const quoteStyle = vs.workspace.getConfiguration("autoDocstring").get("quoteStyle").toString();

    return precedingText === quoteStyle;
}

function getPrecedingText(numberOfChars: number, changeEvent: vs.TextDocumentChangeEvent): string {
    const editor = vs.window.activeTextEditor;
    const position = changeEvent.contentChanges[0].range.end;

    const range = new vs.Range(
        position.translate(0, numberOfChars * -1),
        position,
    );

    return editor.document.getText(range);
}

export function deactivate() { return; }
