import { blankLine, getIndentation } from "./utilities";

export function getDocstringIndentation(document: string, linePosition: number, lineCharacter: number = 0): string {
    const lines = document.split("\n");

    let currentLineNum = linePosition;

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];

        if (!blankLine(line) && getIndentation(line)) {
            return getIndentation(line);
        }

        currentLineNum++;
    }

    // Return current cursor indentation.
    return Array(lineCharacter + 1).join(" ");
}
