import * as interfaces from './interfaces'
import * as vscode from 'vscode';

export abstract class DocstringFormatter {
    protected _snippet = new vscode.SnippetString();

    formatDocstring(docstring: interfaces.DocstringParts): vscode.SnippetString {

        this.generateSummaryAndDescription();
        this.formatDecorators(docstring.decorators);
        this.formatArguments(docstring.args);
        this.formatKeywordArguments(docstring.kwargs);

        this.commentText();
        return this._snippet;
    }

    commentText(): void {
        this._snippet.value = '"""' + this._snippet.value + '\n"""';
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

}

