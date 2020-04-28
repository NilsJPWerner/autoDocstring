import { getBody, getDefinition, getFunctionName, parseParameters, tokenizeDefinition, getDocstringType } from ".";
import { DocstringParts } from "../docstring_parts";

export function parse(document: string, positionLine: number): DocstringParts {
    const definition = getDefinition(document, positionLine);
    const docstringType = getDocstringType(definition, positionLine)
    const body = getBody(docstringType, document, positionLine);
    const parameterTokens = tokenizeDefinition(definition);
    const functionName = getFunctionName(definition);

    return parseParameters(docstringType, parameterTokens, body, functionName);
}
