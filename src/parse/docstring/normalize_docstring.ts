import { blankLine } from "../utilities";

export function normalizeDocstring(docstring: string): string {
    let lines = docstring.split("\n");

    lines = normalizeDocstringIndentation(lines);
    lines = removeDocstringQuotes(lines);

    return lines.join("\n");
}

/** Removes docstring block indentation while keeping relative internal
 * documentation consistent
 */
function normalizeDocstringIndentation(lines: string[]): string[] {
    const indentationPattern = /^\s*/;

    let minimumIndentation = " ".repeat(50);
    for (const line of lines) {
        if (blankLine(line)) {
            continue;
        }

        const match = indentationPattern.exec(line);

        if (match[0].length < minimumIndentation.length) {
            minimumIndentation = match[0];
        }
    }

    const minimumIndentationPattern = new RegExp("^" + minimumIndentation);
    lines = lines.map((line) => line.replace(minimumIndentationPattern, ""));

    return lines;
}

/** Remove opening and closing docstring quotes */
function removeDocstringQuotes(lines: string[]): string[] {
    lines = lines.map((line) => line.replace(/^\s*("""|''')/, ""));
    lines = lines.map((line) => line.replace(/("""|''')\s*$/, ""));
    return lines;
}
