import { getBody, getDefinition, getFunctionName, parseParameters, tokenizeDefinition, getDocstringType } from ".";
import { DocstringParts } from "../docstring_parts";
// import * as vs from "vscode";

export function parse(document: string, positionLine: number): DocstringParts {
    // vs.window.showErrorMessage("here");
    const definition = getDefinition(document, positionLine);
    const docstringType = getDocstringType(definition, positionLine)
    const body = getBody(docstringType, document, positionLine);
    const parameterTokens = tokenizeDefinition(definition);
    const functionName = getFunctionName(definition);

    console.log(docstringType)
    console.log(body)
    console.log(parameterTokens)
    console.log(functionName)

    return parseParameters(docstringType, parameterTokens, body, functionName);
}
