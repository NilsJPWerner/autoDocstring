import { blankLine, indentationOf } from "./utilities";

export function getDefinition(document: string, linePosition: number): string {
    const lines = document.split("\n");
    let definition = "";

    if (linePosition === 0) {
        return definition;
    }

    let currentLineNum = linePosition - 1;
    const originalIndentation = indentationOf(lines[currentLineNum]);

    while (currentLineNum >= 0) {
        const line = lines[currentLineNum];
        definition = line.trim() + definition;

        if (indentationOf(line) < originalIndentation || blankLine(line)) {
            break;
        }

        currentLineNum -= 1;
    }

    return definition;
}

export function getBody(document: string, linePosition: number): string[] {
    const lines = document.split("\n");
    const body = [];

    let currentLineNum = linePosition;
    const originalIndentation = indentationOf(lines[currentLineNum]);

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];

        if (blankLine(line)) {
            currentLineNum++;
            continue;
        }

        if (indentationOf(line) < originalIndentation) {
            break;
        }

        body.push(line.trim());
        currentLineNum++;
    }

    return body;
}
