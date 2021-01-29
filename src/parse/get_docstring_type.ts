export function getDocstringType(functionDefinition: string, linePosition: number): string {

    const class_pattern = /(?:class)/;
    const class_match = class_pattern.exec(functionDefinition);

    if (linePosition === 0) {
        return "module"
    }
    
    else if (class_match != undefined && class_match[0] != undefined) {
        return "class";
    }

    else  {
        return "method";
    }

}
