import * as path from "path";
import * as vs from "vscode";
import { DocstringFactory } from "./docstring/docstring_factory";
import { getCustomTemplate, getTemplate } from "./docstring/get_template";
import { getDocstringIndentation, parse } from "./parse";

export class AutoDocstring {

    private editor: vs.TextEditor;
    private logger: vs.OutputChannel;

    constructor(editor: vs.TextEditor, logger: vs.OutputChannel) {
        this.editor = editor;
        this.logger = logger;
    }

    public generateDocstring(): Thenable<boolean> {
        const position = this.editor.selection.active;
        this.log(`Generating Docstring at line: ${position.line}`);
        const document = this.editor.document.getText();

        const docstringSnippet = this.generateDocstringSnippet(document, position);
        const insertPosition = position.with(undefined, 0);
        this.log(`Docstring generated:\n${docstringSnippet.value}`);
        this.log(`Inserting at position: ${insertPosition.line} ${insertPosition.character}`);

        const success = this.editor.insertSnippet(docstringSnippet, insertPosition);
        success.then(
            () => this.log("Successfully inserted docstring"),
            (reason) => {
                this.log("Error: " + reason);
                vs.window.showErrorMessage("AutoDocstring could not insert docstring:", reason);
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
        const indentation = getDocstringIndentation(document, position.line);
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

        try {
            return getCustomTemplate(customTemplatePath);
        } catch (err) {
            const errorMessage = "AutoDocstring Error: Template could not be found: " + customTemplatePath;
            this.log(errorMessage);
            vs.window.showErrorMessage(errorMessage);
        }
    }

    private getConfig(): vs.WorkspaceConfiguration {
        return vs.workspace.getConfiguration("autoDocstring");
    }

    private log(line: string) {
        const time = new Date();
        this.logger.appendLine(`${time.toISOString()}: ${line}`);
    }
}
