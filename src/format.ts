// import { Docstring } from "./parse";
import * as interfaces from './interfaces';
import { DocstringFormatter } from './formatter'
import * as vscode from 'vscode';

export class FormatDocstringDocblockr extends DocstringFormatter {

    generateSummaryAndDescription(){
        // this._snippet.appendText("[summary]\n\n[description]\n\n");
        this._snippet.appendPlaceholder("[summary]\n\n");
        this._snippet.appendPlaceholder("[description]\n\n");
    }

    formatDecorators(decorators: interfaces.Decorator[]) {
        if (decorators.length > 0) {
            this.appendText("Decorators:\n");
            for (let decorator of decorators) {
                this.appendText("\t");
                this.appendPlaceholder(decorator.name);
                this.appendNewLine();
            }
            this.appendNewLine();
        }
    }

    formatArguments(args: interfaces.Argument[]) {
        if (args.length > 0) {
            this.appendText("Arguments:\n");
            for (let arg of args) {
                this.appendText("\t" + arg.var + " {");
                this.appendPlaceholder("[type]");
                this.appendText("} -- ");
                this.appendPlaceholder("[description]");
                this.appendNewLine();
            }
            this.appendNewLine();
        }
    }

    formatKeywordArguments(kwargs: interfaces.KeywordArgument[]) {
        if (kwargs.length > 0) {
            this.appendText("Keyword Arguments:\n");
            for (let kwarg of kwargs) {
                this.appendText("\t" + kwarg.var + " {");
                this.appendPlaceholder("[type]");
                this.appendText("} -- ");
                this.appendPlaceholder("[description]");
                this.appendText(" (default: {");
                this.appendPlaceholder("[description]");
                this.appendText("})\n");
            }
            this.appendNewLine();
        }
    }

}

