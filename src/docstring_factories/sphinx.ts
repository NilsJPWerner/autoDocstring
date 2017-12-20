import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class SphinxFactory extends BaseFactory {

    generateSummary(){
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
            this.appendText("\t" + decorator.name + "\n");
        }
    }

    formatArguments(docstring: interfaces.DocstringParts) {
        for (let arg of docstring.args) {
            this.appendText(":param " + arg.var + ": ")
            this.appendPlaceholder("[description]")
            this.appendNewLine()

            this.appendText(":type " + arg.var + ": ")
            this.appendPlaceholder("[type]")
            this.appendNewLine()
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        for (let kwarg of docstring.kwargs) {
            this.appendText(":param " + kwarg.var + ": ")
            this.appendPlaceholder("[description]")
            this.appendText(", defaults to " + kwarg.default)
            this.appendNewLine()

            this.appendText(":param " + kwarg.var + ": ")
            this.appendPlaceholder("[type]")
            this.appendPlaceholder(", optional")
            this.appendNewLine()
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        for (let raise of raises) {
            this.appendText(":raises " + raise.error + ": ");
            this.appendPlaceholder("[cause]");
            this.appendNewLine()
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText(":return: ");
        this.appendPlaceholder("[description]");
        this.appendNewLine()

        this.appendText(":rtype: ");
        this.appendPlaceholder("[type]");
        this.appendNewLine()
    }
}
