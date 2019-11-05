import { blankLine, indentationOf } from "./utilities";

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
