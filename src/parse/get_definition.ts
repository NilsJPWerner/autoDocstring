import { blankLine, indentationOf } from "./utilities";

export function getDefinition(document: string, linePosition: number): string {
    const lines = document.split("\n");
    let definition = "";

    if (linePosition === 0) {
        return definition;
    }

    let currentLineNum = linePosition - 1;
    const originalIndentation = indentationOf(lines[currentLineNum]);
    // console.log("original indentation")
    // console.log(originalIndentation)

    while (currentLineNum >= 0) {
        const line = lines[currentLineNum];
        definition = line.trim() + definition;

        if (indentationOf(line) < originalIndentation || blankLine(line)) {
            break;
        }

        currentLineNum -= 1;
    }

    //const classPattern = /(?:class)/;
    const classPattern = /(?:class)\s+(\w+)/;
    const classMatch = classPattern.exec(definition);

    if (classMatch != undefined && classMatch[0] != undefined) {
        currentLineNum += 2;
        let definition = classMatch[0];
        // console.log("new definition")
        // console.log(definition)
        // console.log(classMatch)
        // console.log("current line num")
        // console.log(currentLineNum)
        // console.log("current indentation")
        // console.log(indentationOf(lines[currentLineNum]))
        // console.log(lines[currentLineNum])
        const initPattern = /(?:def __init__)/;

        while (currentLineNum < lines.length) {
            const line = lines[currentLineNum];
            // console.log("current indentation")
            // console.log(indentationOf(line))
            const initMatch = initPattern.exec(line)

            if (initMatch != undefined && initMatch[0] != undefined) {
                const newIndentation = indentationOf(lines[currentLineNum]);

                while (currentLineNum < lines.length) {
                    const line = lines[currentLineNum];
                    definition += line.trim();
                    // console.log(definition)

                    if (indentationOf(line) < newIndentation || blankLine(line)) {
                        return definition;
                    }

                    currentLineNum += 1;
                }
                
            }
            else if (indentationOf(line) <= originalIndentation && !blankLine(line)) {
                return definition;
            }
            currentLineNum += 1;
        }
    }
    // console.log("last definition")
    // console.log(definition)
    return definition;
}
