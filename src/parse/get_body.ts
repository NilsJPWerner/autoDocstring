import { blankLine, indentationOf, preprocessLines } from "./utilities";

export function getBody(docstringType: string, document: string, linePosition: number): string[] {
    const lines = document.split("\n");
    const body = [];
    let regex = '\s*def \w+'

    if (docstringType === 'module') {
        return lines;
    }
    else if (docstringType === 'class') {
        let regex = '.';
    }

    let currentLineNum = linePosition;
    const originalIndentation = getBodyBaseIndentation(lines, linePosition, regex);
    // console.log("original indentation")
    // console.log(originalIndentation)
    // console.log(currentLineNum)

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];
        // console.log("current indentation")
        // console.log(indentationOf(line))
        // console.log(currentLineNum)

        if (blankLine(line)) {
            currentLineNum++;
            continue;
        }

        if (indentationOf(line) < originalIndentation) {
            break;
        }

        body.push(line);
        currentLineNum++;
    }

    return preprocessLines(body);
}

function getBodyBaseIndentation(lines: string[], linePosition: number, regex: string): number {
    let currentLineNum = linePosition;
    //const functionDefRegex = /\s*def \w+/;
    const functionDefRegex = RegExp(regex)

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];

        if (blankLine(line)) {
            currentLineNum++;
            continue;
        }

        if (functionDefRegex.test(line)) {
            break;
        }

        return indentationOf(line);
    }

    return 10000;
}
