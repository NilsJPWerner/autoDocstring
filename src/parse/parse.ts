import { DocstringParts } from "../docstring_parts";
import { getFunctionName } from "./get_function_name";
import { getBody, getDefinition } from "./get_lines";
import { parseParameters } from "./parse_parameters";
import { tokenizeDefinition } from "./tokenize_definition";

export function parse(document: string, positionLine: number): DocstringParts {
    const definition = getDefinition(document, positionLine);
    const body = getBody(document, positionLine);

    const parameterTokens = tokenizeDefinition(definition);
    const functionName = getFunctionName(definition);

    return parseParameters(parameterTokens, body, functionName);
}
