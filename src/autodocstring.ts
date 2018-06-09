import * as vs from 'vscode';
import * as factories from './docstring_factories/factories'
import { parse } from './parse/parse'
import { docstringIsClosed } from './parse/closed_docstring'
import { isMultiLineString } from './parse/multi_line_string'


export class AutoDocstring {
    private docstringFactory: factories.BaseFactory;
    private editor: vs.TextEditor;
    private quoteStyle: string;

    constructor(editor: vs.TextEditor, quoteStyle: string) {
        this.editor = editor;
        this.quoteStyle = quoteStyle;

        let docstringFormat = vs.workspace.getConfiguration("autoDocstring").get("docstringFormat");
        switch (docstringFormat) {
            case "google":
                this.docstringFactory = new factories.GoogleFactory(quoteStyle);
                break;

            case "sphinx":
                this.docstringFactory = new factories.SphinxFactory(quoteStyle);
                break;

            case "numpy":
                this.docstringFactory = new factories.NumpyFactory(quoteStyle);
                break;

            default:
                this.docstringFactory = new factories.DefaultFactory(quoteStyle);
        }
    }

    public generateDocstring(onEnter: boolean) {
        let document = this.editor.document.getText();
        let position = this.editor.selection.active
        let linePosition = position.line;
        let charPosition = position.character;

        if (!onEnter) {

        }

        // Check whether the docstring is already closed for enter activation
        if (!onEnter || this.validEnterActivation(document, linePosition, charPosition, this.quoteStyle)) {

            let docstringParts = parse(document, linePosition);
            let docstringSnippet = this.docstringFactory.createDocstring(docstringParts, !onEnter);

            this.editor.insertSnippet(docstringSnippet, position)
        }
    }

    validEnterActivation(document: string, linePosition: number, charPosition: number, quoteStyle: string): boolean {
        console.log("multiline: ", isMultiLineString(document, linePosition, charPosition, quoteStyle))
        console.log("closed: ", docstringIsClosed(document, linePosition, charPosition, quoteStyle))

        return (
            !isMultiLineString(document, linePosition, charPosition, quoteStyle) &&
            !docstringIsClosed(document, linePosition, charPosition, quoteStyle)
        )
    }
}
