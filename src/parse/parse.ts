import { getBody, getDefinition, getFunctionName, parseParameters, tokenizeDefinition} from ".";
import { DocstringParts } from "../docstring_parts";

export function parse(document: string, positionLine: number): DocstringParts {
    const definition = getDefinition(document, positionLine);
    const body = getBody(document, positionLine);
    // console.log(`Body parsed:\n${body}`)
    // console.log("Body parsed")
    // for (const line of body) {
    //     console.log(line)
    // }

    const parameterTokens = tokenizeDefinition(definition);
    const functionName = getFunctionName(definition);

    return parseParameters(positionLine, parameterTokens, body, functionName);
}
