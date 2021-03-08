export function getClassName(functionDefinition: string): string {
    //const pattern1 = /(?:class)\s+(\w+)\s*\(/;
    const pattern1 = /(?:class)\s+(\w+)/;
    const pattern2 = /(?:class)\s+(\w+)/;

    const match1 = pattern1.exec(functionDefinition);
    const match2 = pattern2.exec(functionDefinition);

    if (match1 != undefined && match1[1] != undefined) {
        return match1[1];
    }
    else if (match2 != undefined && match2[1] != undefined) {
        return match2[1]
    }
    else {
        return "";
    }
}
