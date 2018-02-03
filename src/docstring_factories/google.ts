import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class GoogleFactory extends BaseFactory {

    generateSummary() {
        this._snippet.appendPlaceholder("[summary]");
        this.appendNewLine();
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
        if (docstring.args.length > 0 || docstring.kwargs.length > 0) {
            this.appendText("\nArgs:\n");
        }
        for (let arg of docstring.args) {
            this.appendText(`\t${arg.var} (`);
            if (arg.type) {this.appendText(`${arg.type}`);}
            else {this.appendPlaceholder("[type]");}
            this.appendText("): ");
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        console.log("kwargs")
        console.log(docstring.kwargs)
        for (let kwarg of docstring.kwargs) {
            this.appendText(`\t${kwarg.var} (`);
            if (kwarg.type) {this.appendText(`${kwarg.type}`);}
            else {this.appendPlaceholder("[type]");}
            this.appendText(`, optional): Defaults to ${kwarg.default}. `);
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("\nRaises:\n");
        for (let raise of raises) {
            this.appendText(`\t${raise.error}: `);
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText("\nReturns:\n");
        this.appendText("\t");
        if (returns.value_type) {this.appendText(`${returns.value_type}`);}
        else {this.appendPlaceholder("[type]");}
        this.appendText(": ");
        this.appendPlaceholder("[description]");
        this.appendNewLine();
    }

}
