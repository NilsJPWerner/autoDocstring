// export function getDocstringRange(document: string, lineNum: number): ;

export function getDocstringStartIndex(lines: string[], lineNum: number) {
    const docstringStartPattern = /^\s*("""|''')/;

    if (lineNum == 0) {
        return 0;
    }

    // If the starting line contains only docstring quotes and the previous
    // line is not the function definition we can assume that we are at the
    // end quotes of the docstring and should shift our position back 1
    if (isOnlyDocstringQuotes(lines[lineNum]) && !isFunctionDefinition(lines[lineNum - 1])) {
        lineNum -= 1;
    }

    while (lineNum >= 0) {
        const line = lines[lineNum];
        if (docstringStartPattern.test(line)) {
            return lineNum;
        }
        lineNum--;
    }

    return undefined;
}

export function getDocstringEndIndex(lines: string[], lineNum: number) {
    const docstringEndPattern = /("""|''')\s*$/;

    if (lineNum >= lines.length - 1) {
        return lineNum;
    }

    // If the starting line contains only docstring quotes and the previous
    // line is the function definition we can assume that we are at the
    // start quotes of the docstring and should shift our position forward 1
    if (isOnlyDocstringQuotes(lines[lineNum]) && isFunctionDefinition(lines[lineNum - 1])) {
        lineNum += 1;
    }

    while (lineNum < lines.length) {
        const line = lines[lineNum];
        if (docstringEndPattern.test(line)) {
            return lineNum;
        }
        lineNum++;
    }

    return undefined;
}

/** Line contains only a docstring opening or closing quotes */
function isOnlyDocstringQuotes(line: string): boolean {
    return /^\s*("""|''')\s*$/.test(line);
}

/** Line contains the last part of a function definition */
function isFunctionDefinition(line: string): boolean {
    return /(:|(?=[#'"\n]))/.test(line);
}
