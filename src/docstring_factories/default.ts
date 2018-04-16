import * as interfaces from '../docstring_parts';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class DefaultFactory extends BaseFactory {

    generateSummary(docstring: interfaces.DocstringParts){
        if (this._includeName) {
            this._snippet.appendText(`${docstring.name} `);
        }

        this._snippet.appendPlaceholder("[summary]");
        this.appendNewLine()
    }

    generateDescription() {
        this.appendNewLine();
        this._snippet.appendPlaceholder("[description]");
        this.appendNewLine();
    }

    formatDecorators(decorators: interfaces.Decorator[]) {
        this.appendText("\nDecorators:\n");
        for (let decorator of decorators) {
            this.appendText(`\t${decorator.name}\n`);
        }
    }

    formatArguments(docstring: interfaces.DocstringParts) {
        this.appendText("\nArguments:\n");
        for (let arg of docstring.args) {
            this.appendText(`\t${arg.var} {`);
            this.appendPlaceholder(`${arg.type}`);
            this.appendText("} -- ");
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        this.appendText("\nKeyword Arguments:\n");
        for (let kwarg of docstring.kwargs) {
            this.appendText(`\t${kwarg.var} {`);
            this.appendPlaceholder(`${kwarg.type}`);
            this.appendText("} -- ");
            this.appendPlaceholder("[description]");
            this.appendText(` (default: {${kwarg.default}})\n`);
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("\nRaises:\n");
        for (let raise of raises) {
            this.appendText(`\t${raise.exception} -- `);
            this.appendPlaceholder("[description]");
            this.appendNewLine()
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText(`\nReturns:\n`);
        this.appendText("\t");
        this.appendPlaceholder(`${returns.type}`);
        this.appendText(" -- ");
        this.appendPlaceholder("[description]");
        this.appendNewLine()
    }

}

