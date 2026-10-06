import { getDocstringStartIndex, getDocstringEndIndex } from "./get_docstring_range";

export function getDocstring(document: string, lineNum: number): string {
    const lines = document.split("\n");

    const startIndex = getDocstringStartIndex(lines, lineNum);
    const endIndex = getDocstringEndIndex(lines, lineNum);

    if (startIndex == undefined || endIndex == undefined) {
        return "";
    }

    const docstringLines = lines.slice(startIndex, endIndex + 1);
    return docstringLines.join("\n");
}
