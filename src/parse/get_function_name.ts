
export function getFunctionName(functionDefinition: string): string {
    let pattern = /(?:def|class)\s+(\w+)\s*\(/;

    let match = pattern.exec(functionDefinition);

    if (match == undefined || match[1] == undefined) {
        return "";
    };

    return match[1]
}
