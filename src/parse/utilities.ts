export function indentationOf(line: string): number {
    let whiteSpaceMatches = line.match(/^\s+/);

    if (whiteSpaceMatches == undefined) {
        return 0;
    }

    return whiteSpaceMatches[0].length;
}

export function blankLine(line: string): boolean {
    return (line.match(/[^\s]/) == undefined)
}
