import * as vscode from 'vscode';

export function parseFunction(document: vscode.TextDocument, position: vscode.Position) {
    let definition = this.getDefinition(document, position);
    console.log()
}

function getDefinition(document: vscode.TextDocument, position: vscode.Position): string {
    let definitionLines = []
    let lineNum = position.line - 1
    let originalIndentation = this.getIndentation(document.lineAt(lineNum))

    while (lineNum > -1) {
        let line = document.lineAt(lineNum)
        let indentation = this.getIndentation(line)

        if (line.isEmptyOrWhitespace ||
            indentation < originalIndentation ||
            indentation == 0
        ) {
            break;
        }

        definitionLines.push(line.text);
        lineNum -= 1;
    }

    return definitionLines.join(" ");
}


function getIndentation(line: vscode.TextLine) {
    if (line.isEmptyOrWhitespace) {
        return 0
    }
    return line.firstNonWhitespaceCharacterIndex
}
