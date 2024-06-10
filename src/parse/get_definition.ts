import { blankLine, preprocessLines } from "./utilities";

export function getDefinition(document: string, linePosition: number): string {
    const precedingLines = getPrecedingLines(document, linePosition);
    const precedingText = precedingLines.join(" ");

    // Don't parse if the preceding line is blank
    const precedingLine = precedingLines[precedingLines.length - 1];
    if (precedingLine == undefined || blankLine(precedingLine)) {
        return "";
    }

    // Match (async)? def name (...) and class name (...)
    const pattern = /\b(((async\s+)?\s*def)|\s*class)\s+\w+\s*\(.*?\)/g;

    // Get starting index of last def or class match in the preceding text
    let index: number;
    let match = pattern.exec(precedingText);
    while (match) {
        index = match.index;
        match = pattern.exec(precedingText);
    }

    if (index == undefined) {
        return "";
    }

    const lastFunctionDef = precedingText.slice(index);
    return lastFunctionDef.trim();
}

function getPrecedingLines(document: string, linePosition: number): string[] {
    const lines = document.split("\n");
    const rawPrecedingLines = lines.slice(0, linePosition);

    const precedingLines = preprocessLines(rawPrecedingLines);

    return precedingLines;
}
