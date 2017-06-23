import * as vscode from 'vscode';
import { FunctionParser } from './parse';
import * as factories from './docstring_factories/factories'

export class AutoDocstring {
    // docstringFactory: factories.BaseFactory;
    // why is this not working????
    private _docstring_factory: any;

    // Need to rename this to include classes
    private _function_parser: any;

    constructor() {
        this._function_parser = new FunctionParser();
        let format_config = vscode.workspace.getConfiguration("autoDocstring").get('docstringFormat');
        if (format_config === 'google') {
            this._docstring_factory = new factories.GoogleFactory();
        } else {
            this._docstring_factory = new factories.DefaultFactory();
        }
    }

    public getDocstring(document: vscode.TextDocument, position: vscode.Position) {
        let docstring_parts = this._function_parser.parseLines(document, position);
        return this._docstring_factory.createDocstring(docstring_parts);
    }

    // public validDocstringOpener(document: vscode.TextDocument, position: vscode.Position) {


    //     let regex: RegExp =
    // }

}

// ToDO
// "docthis.includeTypes"
// "includeDescription"
