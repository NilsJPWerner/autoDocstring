import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class NumpyFactory extends BaseFactory {

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
        if (docstring.args.length > 0 || docstring.kwargs.length > 0) {
            this.appendText("Parameters:\n----------\n");
        }

        for (let arg of docstring.args) {
            this.appendText(arg.var + " : {")
            this.appendPlaceholder("[type]")
            this.appendText("}\n")

            this.appendText("\t")
            this.appendPlaceholder("[description]")
            this.appendNewLine()
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        for (let kwarg of docstring.kwargs) {
            this.appendText(kwarg.var + " : {")
            this.appendPlaceholder("[type]")
            this.appendText("}, optional\n")

            this.appendText("\t")
            this.appendPlaceholder("[description]")
            this.appendText(" (the default is " + kwarg.default + ", which ")
            this.appendPlaceholder("[default_description]")
            this.appendText(")\n")
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("Raises\n------\n");

        for (let raise of raises) {
            this.appendText(raise.error + "\n\t");
            this.appendPlaceholder("[description]");
            this.appendNewLine()
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText("Returns\n-------\n");
        this.appendPlaceholder("[type]");

        this.appendText("\n\t");
        this.appendPlaceholder("[description]");
        this.appendNewLine()
    }
}
