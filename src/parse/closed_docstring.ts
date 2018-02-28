import { indentationOf, blankLine } from './get_lines'

export function docstringIsClosed(document: string, linePosition: number, charPosition: number): boolean {
    let lines = document.split('\n')

    if (quotesCloseExistingDocstring(lines, linePosition, charPosition)) {
        return true;
    }

    if (quotesOpenExistingDocstring(lines, linePosition, charPosition)) {
        return true;
    }

    return false;
}

function quotesCloseExistingDocstring(lines: string[], linePosition: number, charPosition: number): boolean {
    let linesBeforePosition = sliceUpToPosition(lines, linePosition, charPosition);
    let numberOfTripleQuotes = 0;

    for (let line of linesBeforePosition.reverse()) {
        if (line.includes('def ') || line.includes('class ')) {
            break
        };

        numberOfTripleQuotes += occurences(line, '"""');
    }

    return (numberOfTripleQuotes % 2 == 0);
}

function quotesOpenExistingDocstring(lines: string[], linePosition: number, charPosition: number): boolean {
    let linesAfterPosition = sliceFromPosition(lines, linePosition, charPosition);
    let originalIndentation = indentationOf(lines[linePosition]);

    // Need to check first line sepearately because indentation was sliced off
    if (linesAfterPosition[0].includes('"""')) {
        return true;
    }

    for (let line of linesAfterPosition.slice(1)) {
        if (line.includes('"""')) {
            return true;
        }

        if ((!blankLine(line) && indentationOf(line) < originalIndentation) ||
           (line.includes('def ') || line.includes('class '))) {
            return false;
        };
    }

    return false;
}

function sliceUpToPosition(lines: string[], linePosition: number, charPosition: number): string[] {
    let slicedDocument = lines.slice(0, linePosition);
    slicedDocument.push(lines[linePosition].slice(0, charPosition))

    return slicedDocument;
}

function sliceFromPosition(lines: string[], linePosition: number, charPosition: number): string[] {
    let slicedDocument = [lines[linePosition].slice(charPosition)];
    slicedDocument = slicedDocument.concat(lines.slice(linePosition + 1));

    return slicedDocument;
}

function occurences(string: string, word: string): number {
    return string.split(word).length - 1;
}
