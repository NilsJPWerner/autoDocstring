export function getFunctionName(functionDefinition: string): string {
    const pattern = /(?:def|class)\s+(\w+)\s*\(*/;

    const match = pattern.exec(functionDefinition);

    if (match == undefined || match[1] == undefined) {
        return "";
    }

    return match[1];
}
