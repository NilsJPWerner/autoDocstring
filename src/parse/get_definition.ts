import { blankLine, indentationOf, preprocessLines } from "./utilities";

export function getDefinition(document: string, linePosition: number): string {

    if (linePosition === 0) {
        return "";
    }

    const precedingLines = getPrecedingLines(document, linePosition);
    const precedingText = precedingLines.join(" ");

    // Don't parse if the preceding line is blank
    const precedingLine = precedingLines[precedingLines.length - 1];
    if (precedingLine == undefined || blankLine(precedingLine)) {
        return "";
    }

    const pattern = /\b(((async\s+)?\s*def)|\s*class)\b/g;

    // Get starting index of last def match in the preceding text
    let index: number;
    while (pattern.test(precedingText)) {
        index = pattern.lastIndex - RegExp.lastMatch.length;
    }

    if (index == undefined) {
        return "";
    }

    const lastFunctionDef = precedingText.slice(index).trim();

    if (lastFunctionDef.startsWith('class')) {
        const lines = document.split("\n");

        const originalIndentation = indentationOf(lines[linePosition]);
        const classPattern = /(?:class)\s+(\w+)/;
        const classMatch = classPattern.exec(lastFunctionDef);
        let definition = classMatch[0];
        // const initPattern = /(?:def __init__)/;
        const initPattern = /(?<=def __init__).*/;
        const defClosePattern = /(\))/

        while (linePosition < lines.length) {
            const line = lines[linePosition];
            const initMatch = initPattern.exec(line)

            if (initMatch != undefined && initMatch[0] != undefined) {
                definition += initMatch[0];
                const newIndentation = indentationOf(lines[linePosition]);
                let defCloseMatch = defClosePattern.exec(line);
                if (defCloseMatch != undefined && defCloseMatch[0] != undefined) {
                    return definition;
                }
                linePosition += 1;

                while (linePosition < lines.length) {
                    const line = lines[linePosition];
                    definition += line.trim();
                    defCloseMatch = defClosePattern.exec(line);
                    if (indentationOf(line) < newIndentation || blankLine(line)) {
                        return definition;
                    }
                    else if (defCloseMatch != undefined && defCloseMatch[0] != undefined) {
                        return definition;
                    }

                    linePosition += 1;
                }
                
            }
            else if (indentationOf(line) <= originalIndentation && !blankLine(line)) {
                return definition;
            }
            linePosition += 1;
        }

        return definition
    }

    return lastFunctionDef;
}

function getPrecedingLines(document: string, linePosition: number): string[] {
    const lines = document.split("\n");
    const rawPrecedingLines = lines.slice(0, linePosition);

    const precedingLines = preprocessLines(rawPrecedingLines);
    return precedingLines;
}