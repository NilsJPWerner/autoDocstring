import { blankLine, getIndentation } from "./utilities";

export function getDocstringIndentation(document: string, linePosition: number): string {
    const lines = document.split("\n");

    let currentLineNum = linePosition;

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];

        if (!blankLine(line)) {
            const indentation = getIndentation(line);
            if (indentation) {
                return indentation;
            }
        }

        currentLineNum++;
    }

    return "    ";
}
