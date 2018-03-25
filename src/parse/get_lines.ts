import { indentationOf, blankLine } from './utilities'

export function getDefinition(document: string, linePosition: number): string {
    let lines = document.split('\n');
    let definition = "";

    if (linePosition == 0) {
        return definition;
    }

    let currentLineNum = linePosition - 1
    let originalIndentation = indentationOf(lines[currentLineNum]);

    while (currentLineNum >= 0) {
        let line = lines[currentLineNum];
        definition = line.trim() + definition;

        if (indentationOf(line) < originalIndentation || blankLine(line)) {
            break
        };

        currentLineNum -= 1;
    }

    return definition;
}

export function getBody(document: string, linePosition: number): string[] {
    let lines = document.split('\n');
    let body = [];

    let currentLineNum = linePosition;
    let originalIndentation = indentationOf(lines[currentLineNum]);

    while (currentLineNum < lines.length) {
        let line = lines[currentLineNum];

        if (blankLine(line)) {
            currentLineNum++;
            continue
        };

        if (indentationOf(line) < originalIndentation) {
            break
        };

        body.push(line.trim());
        currentLineNum++;
    }

    return body
}
