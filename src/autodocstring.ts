import * as vscode from 'vscode';

export class AutoDocstring {

    public getDocstring(document: vscode.TextDocument, position: vscode.Position) {
        let definition_lines: string[] = this.getDefinitionLines(document, position)
    }

    private getDefinitionLines(document: vscode.TextDocument, position: vscode.Position) {
        let line_num: number = position.line - 1
        let original_indentation: number = this.getIndentation(document.lineAt(line_num))
        let definition_lines: string[] = []

        while (line_num > -1) {
            let line: vscode.TextLine = document.lineAt(line_num)
            if (line.isEmptyOrWhitespace || this.getIndentation(line) != original_indentation) {
                // If line is blank or indentation is different end scan
                break
            }
            definition_lines.push(line.text)
            line_num -= 1
        }
        return definition_lines
    }

    private getIndentation(line: vscode.TextLine) {
        if (line.isEmptyOrWhitespace) {
            return 0
        }
        return line.firstNonWhitespaceCharacterIndex
    }

}
