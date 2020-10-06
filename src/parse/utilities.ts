export function getIndentation(line: string): string {
    const whiteSpaceMatches = line.match(/^[^\S\r]+/);

    if (whiteSpaceMatches == undefined) {
        return "";
    }

    return whiteSpaceMatches[0];
}

/**
 * Preprocess an array of lines.
 * For example trim spaces and discard comments
 * @param lines The lines to preprocess.
 */
export function preprocessLines(lines: string[]): string[] {
    return lines
        .filter((line) => !line.startsWith("#"))
        .map(line => line.split("#")[0].trim());
}

export function indentationOf(line: string): number {
    return getIndentation(line).length;
}

export function blankLine(line: string): boolean {
    return line.match(/[^\s]/) == undefined;
}

export function getDefaultIndentation(useSpaces: boolean, tabSize: number): string {
    if (!useSpaces) {
        return "\t";
    }

    return " ".repeat(tabSize);
}
