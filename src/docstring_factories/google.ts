import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class GoogleFactory extends BaseFactory {

    generateSummary() {
        this._snippet.appendPlaceholder("[summary]\n");
    }

    generateDescription() {
        this.appendNewLine();
        this._snippet.appendPlaceholder("[description]\n");
    }

    formatDecorators(decorators: interfaces.Decorator[]) {
        // this.appendText("\nDecorators:\n");
        // for (let decorator of decorators) {
        //     this.appendText("\t" + decorator.name + "\n");
        // }
    }

    formatArguments(docstring: interfaces.DocstringParts) {
        if (docstring.args.length > 0 || docstring.kwargs.length > 0) {
            this.appendText("\Args:\n");
        }
        for (let arg of docstring.args) {
            this.appendText("\t" + arg.var + ": ");
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        for (let kwarg of docstring.kwargs) {
            this.appendText("\t" + kwarg.var + ": ");
            this.appendPlaceholder("[description]");
            this.appendText(" (default: {" + kwarg.default + "})\n");
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("\nRaises:\n");
        for (let raise of raises) {
            this.appendText("\t" + raise.error + ": ");
            this.appendPlaceholder("[description]\n");
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText("\n" + returns.return_type + ":\n");
        this.appendText("\t");
        this.appendPlaceholder("[description]\n");
        this.appendPlaceholder("[type]\n");
    }

}