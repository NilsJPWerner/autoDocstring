"use strict";
import * as vs from "vscode";
import { AutoDocstring } from "./generate_docstring";
import { docstringIsClosed, validDocstringPrefix } from "./parse";

export const generateDocstringCommand = "autoDocstring.generateDocstring";
let channel: vs.OutputChannel;

export function activate(context: vs.ExtensionContext): void {
    channel = vs.window.createOutputChannel("autoDocstring");

    context.subscriptions.push(
        vs.commands.registerCommand(generateDocstringCommand, () => {
            const editor = vs.window.activeTextEditor;
            const autoDocstring = new AutoDocstring(editor, channel);

            try {
                return autoDocstring.generateDocstring();
            } catch (error) {
                channel.appendLine("Error: " + error);
                vs.window.showErrorMessage("AutoDocstring encountered an error:", error);
            }
        }),

        vs.languages.registerCompletionItemProvider(
            "python",
            {
                provideCompletionItems: (
                    document: vs.TextDocument,
                    position: vs.Position,
                    _: vs.CancellationToken,
                ) => {
                    if (validEnterActivation(document, position)) {
                        channel.appendLine(position.toString());
                        return [new AutoDocstringCompletionItem(document, position)];
                    }
                },
            },
            '"',
            "'",
            "#",
        ),
    );

    channel.appendLine("autoDocstring was activated");
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
    channel.dispose();
}

/**
 * Checks that the preceding characters of the position is a valid docstring prefix
 * and that the prefix is not part of an already closed docstring
 */
function validEnterActivation(document: vs.TextDocument, position: vs.Position): boolean {
    const docString = document.getText();
    const quoteStyle = vs.workspace.getConfiguration("autoDocstring").get("quoteStyle").toString();

    return (
        validDocstringPrefix(docString, position.line, position.character, quoteStyle) &&
        !docstringIsClosed(docString, position.line, position.character, quoteStyle)
    );
}

/**
 * Completion item to trigger generate docstring command on docstring prefix
 */
class AutoDocstringCompletionItem extends vs.CompletionItem {
    constructor(_: vs.TextDocument, position: vs.Position) {
        super("Generate Docstring", vs.CompletionItemKind.Snippet);
        this.insertText = "";
        this.sortText = "\0";

        channel.appendLine("HERE");
        this.range = new vs.Range(new vs.Position(position.line, 0), position);

        this.command = {
            command: generateDocstringCommand,
            title: "Generate Docstring",
        };
    }
}
