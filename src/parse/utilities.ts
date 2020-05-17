export function getIndentation(line: string): string {
    const whiteSpaceMatches = line.match(/^[^\S\r]+/);

    if (whiteSpaceMatches == undefined) {
        return "";
    }

    return whiteSpaceMatches[0];
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
