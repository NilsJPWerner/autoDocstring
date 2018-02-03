import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class DefaultFactory extends BaseFactory {

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
            this.appendText(`\t${decorator.name}\n`);
        }
    }

    formatArguments(docstring: interfaces.DocstringParts) {
        this.appendText("\nArguments:\n");
        for (let arg of docstring.args) {
            this.appendText(`\t${arg.var} {`);
            if (arg.type) {this.appendText(`${arg.type}`);}
            else {this.appendPlaceholder("[type]");}
            this.appendText("} -- ");
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatKeywordArguments(docstring: interfaces.DocstringParts) {
        this.appendText("\nKeyword Arguments:\n");
        for (let kwarg of docstring.kwargs) {
            this.appendText(`\t${kwarg.var} {`);
            this.appendPlaceholder("[type]");
            this.appendText("} -- ");
            this.appendPlaceholder("[description]");
            this.appendText(` (default: {${kwarg.default}})\n`);
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("\nRaises:\n");
        for (let raise of raises) {
            this.appendText(`\t${raise.error} -- `);
            this.appendPlaceholder("[description]");
            this.appendNewLine()
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText(`\n${returns.return_type}:\n`);
        this.appendText("\t");
        if (returns.value_type) {this.appendText(`${returns.value_type}`);}
        else {this.appendPlaceholder("[type]");}
        this.appendText(" -- ");
        this.appendPlaceholder("[description]");
        this.appendNewLine()
    }

}

