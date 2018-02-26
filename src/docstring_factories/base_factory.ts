import * as interfaces from '../interfaces'
import * as vscode from 'vscode';
import { print } from 'util';

export abstract class BaseFactory {

    protected _snippet: vscode.SnippetString;
    protected _includeDescription: boolean;
    protected _includeTypes : boolean;

    constructor() {
        this._snippet = new vscode.SnippetString();

        let config = vscode.workspace.getConfiguration("autoDocstring");
        this._includeDescription = config.get("includeDescription") === true;
        this._includeTypes = config.get("includeTypes") === true;
    }

    createDocstring(docstring: interfaces.DocstringParts, openingQuotes: boolean): vscode.SnippetString {
        // Wipe snippet incase it is dirty
        this._snippet.value = "";

        this.generateSummary();
        if (this._includeDescription) {
            this.generateDescription();
        }

        if (docstring != undefined) {
            if (docstring.decorators.length > 0) {
                this.formatDecorators(docstring.decorators);
            }
            if (docstring.args.length > 0) {
                this.formatArguments(docstring);
            }
            if (docstring.kwargs.length > 0) {
                this.formatKeywordArguments(docstring);
            }
            if (docstring.raises.length > 0) {
                this.formatRaises(docstring.raises);
            }
            if (docstring.returns != undefined) {
                this.formatReturns(docstring.returns);
            }
        }

        this.commentText(openingQuotes);
        return this._snippet;
    }

    commentText(openingQuotes: boolean): void {
        if (openingQuotes) {
            this._snippet.value = '"""' + this._snippet.value + '"""';
        } else {
            this._snippet.value = this._snippet.value + '"""';
        }
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
    abstract formatArguments(args: interfaces.DocstringParts): void;
    abstract formatKeywordArguments(kwargs: interfaces.DocstringParts): void;
    abstract formatRaises(raises: interfaces.Raises[]): void;
    abstract formatReturns(returns: interfaces.Returns): void;

}

