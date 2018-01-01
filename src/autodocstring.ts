import * as vs from 'vscode';
import * as parser from './parse';
import * as factories from './docstring_factories/factories'


export class AutoDocstring {
    private docstringFactory: factories.BaseFactory;
    private pythonParser: parser.PythonParser;
    private editor: vs.TextEditor;

    constructor(editor: vs.TextEditor) {
        this.editor = editor;
        this.pythonParser = new parser.PythonParser();

        let format_config = vs.workspace.getConfiguration('autoDocstring').get('docstringFormat');
        if (format_config === 'google') {
            this.docstringFactory = new factories.GoogleFactory();
        } else {
            this.docstringFactory = new factories.DefaultFactory();
        }
    }

    public generateDocstring(onEnter: boolean) {
        let document = this.editor.document;
        let position = this.editor.selection.active;

        // Check whether the docstring is already closed for enter activation
        if (!onEnter || !this.pythonParser.closedDocstringExists(document, position)) {

            let docstringParts = this.pythonParser.parseLines(document, position);
            let docstringSnippet = this.docstringFactory.createDocstring(docstringParts, !onEnter);

            this.editor.insertSnippet(docstringSnippet, position)
        }
    }
}
