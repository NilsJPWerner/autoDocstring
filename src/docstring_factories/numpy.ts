import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class NumpyFactory extends BaseFactory {

    generateSummary(){
        this._snippet.appendPlaceholder("[summary]");
        this.appendNewLine()
        this.appendNewLine()
    }

    generateDescription() {
        this._snippet.appendPlaceholder("[description]");
        this.appendNewLine();
        this.appendNewLine();
    }

    formatDecorators(decorators: interfaces.Decorator[]) {
        // I need to find an example of decorators in numpy format
    }

    formatArguments(docstring: interfaces.DocstringParts) {
        if (docstring.args.length > 0 || docstring.kwargs.length > 0) {
            this.appendText("Parameters:\n----------\n");
        }

        for (let arg of docstring.args) {
            this.appendText(arg.var + " : {")
            if (arg.type) {this.appendText(`${arg.type}`);}
            else {this.appendPlaceholder("[type]");}
            this.appendText("}\n")

            this.appendText("\t")
            this.appendPlaceholder("[description]")
            this.appendNewLine()
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        for (let kwarg of docstring.kwargs) {
            this.appendText(kwarg.var + " : {")
            if (kwarg.type) {this.appendText(`${kwarg.type}`);}
            else {this.appendPlaceholder("[type]");}
            this.appendText("}, optional\n")

            this.appendText("\t")
            this.appendPlaceholder("[description]")
            this.appendText(" (the default is " + kwarg.default + ", which ")
            this.appendPlaceholder("[default_description]")
            this.appendText(")\n")
        }
        this.appendNewLine()
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("Raises\n------\n");

        for (let raise of raises) {
            this.appendText(raise.error + "\n\t");
            this.appendPlaceholder("[description]");
            this.appendNewLine()
        }
        this.appendNewLine()
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText("Returns\n-------\n");
        if (returns.value_type) {this.appendText(`${returns.value_type}`);}
        else {this.appendPlaceholder("[type]");}

        this.appendText("\n\t");
        this.appendPlaceholder("[description]");
        this.appendNewLine()
    }
}
