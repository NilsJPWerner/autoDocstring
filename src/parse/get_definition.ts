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

    const index = getIndex(precedingText)
    if (index == undefined) {
        return "";
    }

    let lastFunctionDef = precedingText.slice(index).trim();
    if (lastFunctionDef.startsWith('class')) {
        lastFunctionDef = getClassDefinition(document.split("\n"), lastFunctionDef, linePosition)
    }

    return lastFunctionDef;
}

function getClassDefinition(lines: string[], lastFunctionDef: string, linePosition: number): string {
    let definition = getClassName(lastFunctionDef);

    while (linePosition < lines.length) {
        const line = lines[linePosition];               
        definition = updateDefinition(definition, line)

        if (isCloseDefMatch(line)) {
            return definition
        }
        linePosition += 1;
    }

    return definition
}

function updateDefinition(definition: string, line: string): string {
    if (isInitMatch(line)) {
        definition += getInitMatch(line);       
    }
    else {
        definition += line.trim();
    }
    return definition
}

function isInitMatch(line: string): boolean {
    // const initPattern = /(?<=def __init__).*/;
    const initPattern = /(?:def __init__)/;
    const initMatch = initPattern.exec(line)
    return initMatch != undefined && initMatch[0] != undefined;
}

function getInitMatch(line: string): string {
    const initPattern = /(?<=def __init__).*/;
    return initPattern.exec(line)[0].trim()
}

function isCloseDefMatch(line: string): boolean {
    const defClosePattern = /(\))/
    const defCloseMatch = defClosePattern.exec(line);
    return defCloseMatch != undefined && defCloseMatch[0] != undefined;
}

function getClassName(lastFunctionDef: string): string {
    const classPattern = /(?:class)\s+(\w+)/;
    const classMatch = classPattern.exec(lastFunctionDef);
    return classMatch[0];
}

function getIndex(precedingText: string): number {
    const pattern = /\b(((async\s+)?\s*def)|\s*class)\b/g;

    // Get starting index of last def match in the preceding text
    let index: number;
    while (pattern.test(precedingText)) {
        index = pattern.lastIndex - RegExp.lastMatch.length;
    }

    return index
}

function getPrecedingLines(document: string, linePosition: number): string[] {
    const lines = document.split("\n");
    const rawPrecedingLines = lines.slice(0, linePosition);

    const precedingLines = preprocessLines(rawPrecedingLines);
    return precedingLines;
}