import * as path from "path";
import * as vs from "vscode";
import { DocstringFactory } from "./docstring/docstring_factory";
import { getCustomTemplate, getTemplate } from "./docstring/get_template";
import { getDocstringIndentation, getDefaultIndentation, parse } from "./parse";
import { extensionID } from "./constants";
import { logInfo } from "./logger";

export class AutoDocstring {
    private editor: vs.TextEditor;

    constructor(editor: vs.TextEditor) {
        this.editor = editor;
    }

    public generateDocstring(): Thenable<boolean> {
        if (this.editor == undefined) {
            throw new Error(
                "Cannot process this document. It is either too large or is not yet supported.",
            );
        }

        const position = this.editor.selection.active;
        const document = this.editor.document.getText();
        logInfo(`Generating Docstring at line: ${position.line}`);

        const docstringSnippet = this.generateDocstringSnippet(document, position);
        logInfo(`Docstring generated:\n${docstringSnippet.value}`);

        const insertPosition = position.with(undefined, 0);
        logInfo(`Inserting at position: ${insertPosition.line} ${insertPosition.character}`);

        const success = this.editor.insertSnippet(docstringSnippet, insertPosition);

        success.then(
            () => logInfo("Successfully inserted docstring"),
            (reason) => {
                throw new Error("Could not insert docstring: " + reason.toString());
            },
        );

        return success;
    }

    private generateDocstringSnippet(document: string, position: vs.Position): vs.SnippetString {
        const config = this.getConfig();

        const docstringFactory = new DocstringFactory(
            this.getTemplate(),
            config.get("quoteStyle").toString(),
            config.get("startOnNewLine") === true,
            config.get("includeExtendedSummary") === true,
            config.get("includeName") === true,
            config.get("guessTypes") === true,
        );

        const docstringParts = parse(document, position.line);
        const defaultIndentation = getDefaultIndentation(
            this.editor.options.insertSpaces as boolean,
            this.editor.options.tabSize as number,
        );
        const indentation = getDocstringIndentation(document, position.line, defaultIndentation);
        const docstring = docstringFactory.generateDocstring(docstringParts, indentation);

        return new vs.SnippetString(docstring);
    }

    private getTemplate(): string {
        const config = this.getConfig();
        let customTemplatePath = config.get("customTemplatePath").toString();

        if (customTemplatePath === "") {
            const docstringFormat = config.get("docstringFormat").toString();
            return getTemplate(docstringFormat);
        }

        if (!path.isAbsolute(customTemplatePath)) {
            customTemplatePath = path.join(vs.workspace.rootPath, customTemplatePath);
        }

        return getCustomTemplate(customTemplatePath);
    }

    private getConfig(): vs.WorkspaceConfiguration {
        return vs.workspace.getConfiguration(extensionID);
    }
}
