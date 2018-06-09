import { DocstringParts, Decorator, Raises, Returns, removeTypes, addTypePlaceholders } from '../docstring_parts'
import * as vscode from 'vscode';
import { print } from 'util';

export abstract class BaseFactory {

    protected _snippet: vscode.SnippetString;
    protected _newlineBeforeSummary: boolean;
    protected _includeDescription: boolean;
    protected _includeName: boolean;
    protected _guessTypes : boolean;

    private _quoteStyle: string;

    constructor(quoteStyle: string) {
        this._snippet = new vscode.SnippetString();
        this._quoteStyle = quoteStyle;

        let config = vscode.workspace.getConfiguration("autoDocstring");
        this._newlineBeforeSummary = config.get("newlineBeforeSummary") === true;
        this._includeDescription = config.get("includeDescription") === true;
        this._includeName = config.get("includeName") === true;
        this._guessTypes = config.get("guessTypes") === true;
    }

    createDocstring(docstring: DocstringParts, openingQuotes: boolean): vscode.SnippetString {
        this._snippet.value = "";

        if (this._newlineBeforeSummary) {
            this._snippet.appendText("\n");
        }

        this.generateSummary(docstring);

        if (this._includeDescription) {
            this.generateDescription();
        }

        if (!this._guessTypes) {
            removeTypes(docstring);
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
            this._snippet.value = this._quoteStyle + this._snippet.value + this._quoteStyle;
        } else {
            this._snippet.value = this._snippet.value + this._quoteStyle;
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

    abstract generateSummary(docstring: DocstringParts): void;
    abstract generateDescription(): void;
    abstract formatDecorators(decorators: Decorator[]): void;
    abstract formatArguments(args: DocstringParts): void;
    abstract formatKeywordArguments(kwargs: DocstringParts): void;
    abstract formatRaises(raises: Raises[]): void;
    abstract formatReturns(returns: Returns): void;

}

