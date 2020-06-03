import { getBody, getDefinition, getFunctionName, parseParameters, tokenizeDefinition } from ".";
import { DocstringParts } from "../docstring_parts";
// import * as vs from "vscode";

export function parse(document: string, positionLine: number): DocstringParts {
    // vs.window.showErrorMessage("here");
    const definition = getDefinition(document, positionLine);
    // vs.window.showErrorMessage("here2");
    const body = getBody(document, positionLine);
    // vs.window.showErrorMessage("here3");

    const parameterTokens = tokenizeDefinition(definition);
    const functionName = getFunctionName(definition);

    return parseParameters(parameterTokens, body, functionName);
}
