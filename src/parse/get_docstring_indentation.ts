import { blankLine, getIndentation } from "./utilities";

export function getDocstringIndentation(document: string, linePosition: number): string {
    const lines = document.split("\n");

    let currentLineNum = 0;

    while (currentLineNum < lines.length) {
        const line = lines[currentLineNum];

        if (!blankLine(line)) {
            let indentation = getIndentation(line);
            if (indentation.length > 0 && indentation.length <= 4) {
                return indentation;
            }
        }

        currentLineNum++;
    }

    return "";
}
