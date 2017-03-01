import * as interfaces from '../interfaces'
import * as vscode from 'vscode';

export abstract class BaseFactory {

    protected _snippet: vscode.SnippetString;
    protected _includeDescription: boolean;
    protected _includeTypes : boolean;

    constructor() {
        this._snippet = new vscode.SnippetString();
        let config = vscode.workspace.getConfiguration("autoDocstring")
        this._includeDescription = config.get("includeDescription") === true;
        this._includeTypes = config.get("includeTypes") === true;
    }

    createDocstring(docstring: interfaces.DocstringParts): vscode.SnippetString {

        this.generateSummary();
        if (this._includeDescription) {
            this.generateDescription();
        }

        if (docstring != null) {
            if (docstring.decorators.length > 0) {
                this.formatDecorators(docstring.decorators);
            }
            if (docstring.args.length > 0) {
                this.formatArguments(docstring.args);
            }
            if (docstring.kwargs.length > 0) {
                this.formatKeywordArguments(docstring.kwargs);
            }
            if (docstring.raises.length > 0) {
                this.formatRaises(docstring.raises);
            }
            if (docstring.returns != null) {
                this.formatReturns(docstring.returns);
            }
        }

        this.commentText();
        return this._snippet;
    }

    commentText(): void {
        this._snippet.value = '"""' + this._snippet.value + '"""';
    }

    appendText(text: string): void {
        this._snippet.appendText(text);
    }

    appendPlaceholder(text: string): void {
        this._snippet.appendPlaceholder(text);
    }

    appendNewLine(): void {
        this._snippet.appendText("\n");
    }

    abstract generateSummary(): void;
    abstract generateDescription(): void;
    abstract formatDecorators(decorators: interfaces.Decorator[]): void;
    abstract formatArguments(args: interfaces.Argument[]): void;
    abstract formatKeywordArguments(kwargs: interfaces.KeywordArgument[]): void;
    abstract formatRaises(kwargs: interfaces.Raises[]): void;
    abstract formatReturns(kwargs: interfaces.Returns): void;

}

