import * as vscode from 'vscode';

export function getDefinition(document: vscode.TextDocument, position: vscode.Position): string {
    let definition = ""
    let lineNum = position.line - 1
    let originalIndentation = this.getIndentation(document.lineAt(lineNum))

    while (lineNum > -1) {
        let line = document.lineAt(lineNum)
        let indentation = this.getIndentation(line)

        if (indentation < originalIndentation ||
            indentation == 0
        ) {
            break;
        }

        definition = line + definition;
        lineNum -= 1;
    }

    return definition;
}

export function getBody(document: vscode.TextDocument, position: vscode.Position): string {
    let body = "";
    let line_num = position.line;
    let def_indentation = this.getIndentation(document.lineAt(line_num - 1));

    while (line_num < document.lineCount - 1) {
        let line: vscode.TextLine = document.lineAt(line_num);
        if (!line.isEmptyOrWhitespace) {
            if (this.getIndentation(line) <= def_indentation) {
                // If indentation is equal to or less than the definition indentation
                // AND the line is not black end the line scan
                break;
            }
            body += line.text;
        }
        line_num += 1;
    }
    return body;
}

function getIndentation(line: vscode.TextLine) {
    if (line.isEmptyOrWhitespace) {
        return 0
    }
    return line.firstNonWhitespaceCharacterIndex
}
