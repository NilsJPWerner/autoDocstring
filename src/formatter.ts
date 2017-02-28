import * as interfaces from './interfaces'
import * as vscode from 'vscode';

export abstract class BaseFormatter {

    protected _snippet = new vscode.SnippetString();

    formatDocstring(docstring: interfaces.DocstringParts): vscode.SnippetString {

        this.generateSummaryAndDescription();

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

    abstract generateSummaryAndDescription(): void;
    abstract formatDecorators(decorators: interfaces.Decorator[]): void;
    abstract formatArguments(args: interfaces.Argument[]): void;
    abstract formatKeywordArguments(kwargs: interfaces.KeywordArgument[]): void;
    abstract formatReturns(kwargs: interfaces.Returns): void;

}

