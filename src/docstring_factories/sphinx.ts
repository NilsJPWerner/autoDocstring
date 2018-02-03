import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class SphinxFactory extends BaseFactory {

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
         // I need to find an example of decorators in sphinx format
    }

    formatArguments(docstring: interfaces.DocstringParts) {
        for (let arg of docstring.args) {
            this.appendText(":param " + arg.var + ": ")
            this.appendPlaceholder("[description]")
            this.appendNewLine()

            this.appendText(":type " + arg.var + ": ")
            if (arg.type) {this.appendText(`${arg.type}`);}
            else {this.appendPlaceholder("[type]");}
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
            this.appendText(", optional")
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
        if (returns.value_type) {this.appendText(`${returns.value_type}`);}
        else {this.appendPlaceholder("[type]");}
        this.appendNewLine()
    }
}
