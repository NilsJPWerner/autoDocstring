import * as vscode from 'vscode';
import { FunctionParser } from './parse';
import { DocblockrFormatter } from './format'

export class AutoDocstring {

    public getDocstring(document: vscode.TextDocument, position: vscode.Position) {
        let definition_lines: string[] = this.getDefinitionLines(document, position);
        let content_lines: string[] = this.getContentLines(document, position);
        let function_parser = new FunctionParser();
        let docstring_parts = function_parser.parseLines(definition_lines, content_lines);
        let formatter = new DocblockrFormatter();
        return formatter.formatDocstring(docstring_parts);
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

        while (line_num < document.lineCount - 1) {
            let line: vscode.TextLine = document.lineAt(line_num);
            console.log(line.text);
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
        return content_lines;
    }

    private getIndentation(line: vscode.TextLine) {
        if (line.isEmptyOrWhitespace) {
            return 0
        }
        return line.firstNonWhitespaceCharacterIndex
    }

}
