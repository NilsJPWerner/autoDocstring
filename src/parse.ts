import * as vscode from 'vscode';
import { Argument, KeywordArgument, Decorator, Raises, Returns, DocstringParts } from './interfaces';
import { includesFromArray, inArray } from './utils'
import { connect } from 'tls';

export class PythonParser {

    // Need to work on:
    //      regex for tuple input & strings with commas
    //      Guess type

    public closedDocstringExists(document: vscode.TextDocument, position: vscode.Position): boolean {
        let lines = [];
        let lineNum = position.line;
        let indentation = this.getIndentation(document.lineAt(position));

        while (lineNum > -1) {
            let line: vscode.TextLine = document.lineAt(lineNum);
            if (line.text.includes("def ")) {
                break;
            }
            lines.push(line.text);
            lineNum -= 1;
        }

        // Count the niumber of triple quotes
        let linesString = lines.join(" ");
        let numberOfTripleQuotes = linesString.match(/\"\"\"/g).length;

        return (numberOfTripleQuotes === 2);
    }

    public parseLines(document: vscode.TextDocument, position: vscode.Position) {
        let definition_lines: string[] = this.getDefinitionLines(document, position);
        let content_lines: string[] = this.getContentLines(document, position);
        let function_lines: string[] = this.getFunctionLines(document, position);

        if (definition_lines.length == 0 || !/^\s*def /.test(definition_lines[0])) {
            // if no lines were found in definition or
            // first line does not start with def
            return null
        }

        let docstring_parts: DocstringParts = {
            decorators: this.parseDecorators(definition_lines.slice(1)),
            args: this.parseArguments(definition_lines[0]),
            kwargs: this.parseKeywordArguments(definition_lines[0]),
            raises: this.parseRaises(content_lines),
            returns: this.parseReturns(function_lines)
        }
        return docstring_parts
    }

    private getDefinitionLines(document: vscode.TextDocument, position: vscode.Position) {
        let definition_lines: string[] = []
        let line_num: number = position.line - 1
        let original_indentation: number = this.getIndentation(document.lineAt(line_num))

        while (line_num > -1) {
            let line: vscode.TextLine = document.lineAt(line_num)
            if (line.isEmptyOrWhitespace || this.getIndentation(line) != original_indentation) {
                // If line is blank or indentation is different end scan
                break;
            }
            definition_lines.push(line.text);
            line_num -= 1;
        }
        return definition_lines
    }

    private getContentLines(document: vscode.TextDocument, position: vscode.Position) {
        let content_lines: string[] = [];
        let line_num: number = position.line;
        let def_indentation: number = this.getIndentation(document.lineAt(line_num - 1));

        while (line_num < document.lineCount) {
            let line: vscode.TextLine = document.lineAt(line_num);
            if (!line.isEmptyOrWhitespace) {
                if (this.getIndentation(line) <= def_indentation) {
                    // If indentation is equal to or less than the definition indentation
                    // AND the line is not black end the line scan
                    break;
                }
                content_lines.push(line.text);
            }
            line_num += 1;
        }
        return content_lines
    }

    private getFunctionLines(document: vscode.TextDocument, position: vscode.Position) {
        let function_lines: string[] = [];

        let definition_lines = this.getDefinitionLines(document, position);
        let content_lines = this.getContentLines(document, position);

        function_lines = function_lines.concat(definition_lines);
        function_lines = function_lines.concat(content_lines);
        
        return function_lines
    }

    private getIndentation(line: vscode.TextLine) {
        if (line.isEmptyOrWhitespace) {
            return 0
        }
        return line.firstNonWhitespaceCharacterIndex
    }

    private parseDecorators(lines: string[]) {
        let decorators: Decorator[] = [];
        let regex: RegExp = /\s*\@(\w+)/;  // White space, @(chararcters)
        let excluded_decorators = ['classmethod', 'staticmethod', 'property'];

        for (let line of lines) {
            let match = line.match(regex);
            if (match != null && !inArray(match[1], excluded_decorators)) {
                decorators.push({name: match[1]});
            }
        }
        return decorators
    }

    private parseArguments(line: string) {
        let args: Argument[] = [];
        let regex: RegExp = /\(\s*([^)]+?)\s*\)/;
        let excluded_args = ['self', 'cls']

        let param_list = line.match(regex);
        if (param_list == null) return args;

        for (let param of param_list[1].split(/\s*,\s*/)) {
            if (!param.includes('=') && !inArray(param, excluded_args)) {

                // regex looks for pep-484 type annotations
                // example: 'def foo(bar : str)' would match `bar`
                // as variable name, and `str` as type.
                regex = /([\w]*)(?:\s*:\s*([\w]*))?/;
                let semantic_list = param.match(regex);

                args.push({
                    var: semantic_list[1],
                    type: semantic_list[2]
                });
            }
        }
        return args
    }

    private parseKeywordArguments(line: string) {
        let kwargs: KeywordArgument[] = [];
        let match: RegExpExecArray;
        let regex: RegExp = / *(\w+) *(?:: *(\w+) *)?= *([^),]+)\s*/g;

        while ((match = regex.exec(line)) != null) {
            kwargs.push({
                var: match[1],
                default: match[3],
                type: match[2]
            });
        }
        return kwargs
    }

    private parseRaises(lines: string[]) {
        let raises: Raises[] = [];
        let regex: RegExp = /\s*raise\s+([\w.]+)/;

        for (let line of lines) {
            let match = line.match(regex);
            if (match != null) {
                raises.push({error: match[1]});
            }
        }
        return raises;
    }

    private parseReturns(lines: string[]) {
        for (let line of lines) {
            // matches return type annotation
            let annotation_match = /->\s*([^:]+?)\s*:/.exec(line);
            if (annotation_match != null) {
                let v: Returns = {
                    return_type: "Returns",
                    value_type: annotation_match[1]
                };
                return v;
            }

            // if no type annotations are given
            let return_match = /\s*(return|yield)\s+([\w."]+)/.exec(line);
            if (return_match != null) {
                let v: Returns = {
                    return_type: (return_match[1] == "return") ? "Returns" : "Yields",
                    value_type: null
                };
                return v;
            }
        }
        return null;
    }
}
