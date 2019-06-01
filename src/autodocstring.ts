import * as vs from "vscode";
import { DocstringFactory } from "./docstring/docstring_factory";
import { getCustomTemplate, getTemplate } from "./docstring/get_template";
import { docstringIsClosed } from "./parse/closed_docstring";
import { isMultiLineString } from "./parse/multi_line_string";
import { parse } from "./parse/parse";
import * as path from "path";


export class AutoDocstring {

    private docstringFactory: DocstringFactory;
    private editor: vs.TextEditor;
    private quoteStyle: string;

    constructor(editor: vs.TextEditor) {
        this.editor = editor;

        const config = vs.workspace.getConfiguration("autoDocstring");

        this.quoteStyle = config.get("quoteStyle").toString();
        this.docstringFactory = new DocstringFactory(
            this.getTemplate(),
            config.get("quoteStyle").toString(),
            config.get("startOnNewLine") === true,
            config.get("includeExtendedSummary") === true,
            config.get("includeName") === true,
            config.get("guessTypes") === true,
        );
    }

    public generateDocstring() {
        const document = this.editor.document.getText();
        const position = this.editor.selection.active;
        const linePosition = position.line;

        const docstringParts = parse(document, linePosition);
        const docstringSnippet = this.docstringFactory.generateDocstring(docstringParts);

        this.editor.insertSnippet(new vs.SnippetString(docstringSnippet), position);
    }

    public generateDocstringFromEnter() {
        const document = this.editor.document.getText();
        const position = this.editor.selection.active;
        const linePosition = position.line;
        const charPosition = position.character;

        if (this.validEnterActivation(document, linePosition, charPosition)) {
            const docstringParts = parse(document, linePosition);
            const docstringSnippet = this.docstringFactory.generateDocstring(docstringParts, true);

            const range = new vs.Range(position, position.with(position.line + 1));
            this.editor.insertSnippet(new vs.SnippetString(docstringSnippet), range);
        }
    }

    // Checks whether the docstring is already closed or whether the triple quotes are part of a multiline string
    private validEnterActivation(document: string, linePosition: number, charPosition: number): boolean {
        return (
            !isMultiLineString(document, linePosition, charPosition, this.quoteStyle) &&
            !docstringIsClosed(document, linePosition, charPosition, this.quoteStyle)
        );
    }

    private getTemplate(): string {
        const config = vs.workspace.getConfiguration("autoDocstring");
        let customTemplatePath = config.get("customTemplatePath").toString();

        if (customTemplatePath !== "") {

            if (!path.isAbsolute(customTemplatePath)) {
                customTemplatePath = path.join(vs.workspace.rootPath, customTemplatePath);
            }

            try {
                return getCustomTemplate(customTemplatePath);
            }
            catch (err) {
                const errorMessage = "AutoDocstring Error: Template could not be found: " + customTemplatePath;
                vs.window.showErrorMessage(errorMessage);
            }
        } else {
            const docstringFormat = config.get("docstringFormat").toString();
            return getTemplate(docstringFormat);
        }
    }
}
