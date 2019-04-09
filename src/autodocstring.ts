// import { DocstringFactory, getTemplate } from "./docstring";
import * as vs from "vscode";
import { DocstringFactory } from "./docstring/docstring_factory";
import { getTemplate } from "./docstring/get_template";
import { docstringIsClosed } from "./parse/closed_docstring";
import { isMultiLineString } from "./parse/multi_line_string";
import { parse } from "./parse/parse";

export class AutoDocstring {
    private docstringFactory: DocstringFactory;
    private editor: vs.TextEditor;
    private quoteStyle: string;

    constructor(editor: vs.TextEditor) {
        this.editor = editor;

        const config = vs.workspace.getConfiguration("autoDocstring");
        const docstringFormat = config.get("docstringFormat");

        this.quoteStyle = config.get("quoteStyle").toString();
        this.docstringFactory = new DocstringFactory(
            getTemplate(docstringFormat.toString()),
            config.get("quoteStyle").toString(),
            config.get("includeName") === true,
            config.get("includeDescription") === true,
            config.get("includeName") === true,
            config.get("guessTypes") === true,
        );
    }

    public generateDocstring(onEnter: boolean) {
        const document = this.editor.document.getText();
        const position = this.editor.selection.active;
        const linePosition = position.line;
        const charPosition = position.character;

        // Check whether the docstring is already closed for enter activation
        if (!onEnter || this.validEnterActivation(document, linePosition, charPosition)) {

            const docstringParts = parse(document, linePosition);
            const docstringSnippet = this.docstringFactory.generateDocstring(docstringParts, !onEnter);

            this.editor.insertSnippet(new vs.SnippetString(docstringSnippet), position);
        }
    }

    public validEnterActivation(document: string, linePosition: number, charPosition: number): boolean {
        // console.log("multiline: ", isMultiLineString(document, linePosition, charPosition, this.quoteStyle))
        // console.log("closed: ", docstringIsClosed(document, linePosition, charPosition, this.quoteStyle))

        return (
            !isMultiLineString(document, linePosition, charPosition, this.quoteStyle) &&
            !docstringIsClosed(document, linePosition, charPosition, this.quoteStyle)
        );
    }
}
