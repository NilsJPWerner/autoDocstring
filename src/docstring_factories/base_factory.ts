import { DocstringParts, Decorator, Raises, Returns, removeTypes, addTypePlaceholders } from '../docstring_parts'
import * as vscode from 'vscode';
import { print } from 'util';

export abstract class BaseFactory {

    protected _snippet: vscode.SnippetString;
    protected _includeDescription: boolean;
    protected _guessTypes : boolean;

    constructor() {
        this._snippet = new vscode.SnippetString();

        let config = vscode.workspace.getConfiguration("autoDocstring");
        this._includeDescription = config.get("includeDescription") === true;
        this._guessTypes = config.get("guessTypes") === true;
    }

    createDocstring(docstring: DocstringParts, openingQuotes: boolean): vscode.SnippetString {
        this._snippet.value = "";
        this.generateSummary();

        if (this._includeDescription) {
            this.generateDescription();
        }

        if (!this._guessTypes) {
            removeTypes(docstring)
        }

        addTypePlaceholders(docstring, '[type]')

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
    abstract formatDecorators(decorators: Decorator[]): void;
    abstract formatArguments(args: DocstringParts): void;
    abstract formatKeywordArguments(kwargs: DocstringParts): void;
    abstract formatRaises(raises: Raises[]): void;
    abstract formatReturns(returns: Returns): void;

}

