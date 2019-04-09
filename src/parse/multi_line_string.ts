import { blankLine, indentationOf } from "./utilities";

export function isMultiLineString(document: string, linePosition: number,
                                  charPosition: number, quoteStyle: string): boolean {
    const lines = document.split("\n");
    const linePrecedingPosition = lines[linePosition].slice(0, charPosition - 3);

    linePrecedingPosition.replace(quoteStyle, "");

    if (blankLine(linePrecedingPosition)) {
        return false;
    }

    return true;
}
