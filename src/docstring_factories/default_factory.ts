// import { Docstring } from "./parse";
import * as interfaces from '../interfaces';
import { BaseFactory } from './base_factory'
import * as vscode from 'vscode';

export class DefaultFactory extends BaseFactory {

    generateSummary(){
        this._snippet.appendPlaceholder("[summary]\n");
    }

    generateDescription() {
        this.appendNewLine();
        this._snippet.appendPlaceholder("[description]\n");
    }

    formatDecorators(decorators: interfaces.Decorator[]) {
        this.appendText("\nDecorators:\n");
        for (let decorator of decorators) {
            this.appendText("\t" + decorator.name + "\n");
        }
    }

    formatArguments(args: interfaces.Argument[]) {
        this.appendText("\nArguments:\n");
        for (let arg of args) {
            this.appendText("\t" + arg.var + " {");
            this.appendPlaceholder("[type]");
            this.appendText("} -- ");
            this.appendPlaceholder("[description]");
            this.appendNewLine();
        }
    }

    formatKeywordArguments(kwargs: interfaces.KeywordArgument[]) {
        this.appendText("\nKeyword Arguments:\n");
        for (let kwarg of kwargs) {
            this.appendText("\t" + kwarg.var + " {");
            this.appendPlaceholder("[type]");
            this.appendText("} -- ");
            this.appendPlaceholder("[description]");
            this.appendText(" (default: {" + kwarg.default + "})\n");
        }
    }

    formatRaises(raises: interfaces.Raises[]) {
        this.appendText("\nRaises:\n");
        for (let raise of raises) {
            this.appendText("\t" + raise.error + " -- ");
            this.appendPlaceholder("[description]\n");
        }
    }

    formatReturns(returns: interfaces.Returns) {
        this.appendText("\n" + returns.return_type + ":\n");
        this.appendText("\t");
        this.appendPlaceholder("[type]");
        this.appendText(" -- ");
        this.appendPlaceholder("[description]\n");
    }

}

