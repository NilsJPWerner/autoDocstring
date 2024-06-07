export function tokenizeDefinition(functionDefinition: string): string[] {
    const definitionPattern =
        /(?:def|class)\s+\w+\s*\(([\s\S]*)\)\s*(->\s*(["']?)[\w\[\], |\.]*\3)?:\s*(?:#.*)?$/;

    const match = definitionPattern.exec(functionDefinition);
    if (match == undefined || match[1] == undefined) {
        return [];
    }

    const tokens = tokenizeParameterString(stripComments(match[1]));

    if (match[2] != undefined) {
        tokens.push(match[2]);
    }

    return tokens;
}

function stripComments(parameterString: string): string {
    let cleanString = "";
    let position = 0;

    while (position < parameterString.length) {
        // When a comment is encountered, skip ahead to the end of the line
        if (parameterString[position] === "#") {
            position = parameterString.indexOf("\n", position);
        }

        cleanString += parameterString[position++];
    }

    return cleanString;
}

function tokenizeParameterString(parameterString: string): string[] {
    const stack: string[] = [];
    const parameters: string[] = [];
    let arg = "";

    let position = parameterString.length - 1;

    while (position >= 0) {
        const top = stack[stack.length - 1];
        let char = parameterString.charAt(position);

        /* todo
            '<' char,
            error management
        */
        switch (true) {
            // 1. Check for top level comma and push arg to array
            case char === "," && stack.length === 0:
                parameters.unshift(arg);
                arg = "";
                position -= 1;
                continue;

            // 2. Check for closing double or single quote of string
            case char === '"' && top === '"':
            case char === "'" && top === "'":
                stack.pop();
                break;

            // 3.  Do nothing if quote at the top of stack
            case top === '"':
            case top === "'":
                break;

            // 4. Push single and double quotes to stack
            case char === '"':
            case char === "'":
                stack.push(char);
                break;

            // 5. Check for closing of tuples, arrays, or dicts
            case char === "(" && top === ")":
            case char === "[" && top === "]":
            case char === "{" && top === "}":
                stack.pop();
                break;

            // 6. Do nothing if closing char but no matching char on stack
            case char === "(":
            case char === "[":
            case char === "{":
                break;

            // 7. Push opening char to stack
            case char === ")":
            case char === "]":
            case char === "}":
                stack.push(char);
                break;

            // 8. Disregard whitespace at top level of stack
            case char === " " && stack.length === 0:
            case char === "\n" && stack.length === 0:
            case char === "\t" && stack.length === 0:
                position -= 1;
                continue;

            // 9. Surround pipe character with whitespace
            case char === "|":
                char = ` ${char}`;
                arg = ` ${arg}`;
                break;
        }

        arg = char + arg;
        position -= 1;
    }

    if (arg.length > 0) {
        parameters.unshift(arg);
    }

    return parameters;
}
