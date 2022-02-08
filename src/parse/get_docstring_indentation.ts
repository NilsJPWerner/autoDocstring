import { blankLine, getIndentation } from "./utilities";

export function getDocstringIndentation(
    document: string,
    linePosition: number,
    defaultIndentation: string,
): string {

    if (linePosition === 0) {
        return ""
    }
    const lines = document.split("\n");
    const definitionPattern = /\b(((async\s+)?\s*def)|\s*class)\b/g;

    let currentLineNum = linePosition;

    while (currentLineNum >= 0) {
        const currentLine = lines[currentLineNum];

        if (!blankLine(currentLine)) {
            if (definitionPattern.test(currentLine)) {
                return getIndentation(currentLine) + defaultIndentation;
            }
        }

        currentLineNum--;
    }

    return defaultIndentation;
}
