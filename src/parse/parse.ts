import { getDefinition, getBody } from './get_lines'
import { DocstringParts } from '../docstring_parts'
import { parseParameters } from './parse_parameters'
import { tokenizeDefinition } from './tokenize_definition'
import { getFunctionName } from './get_function_name'

export function parse(document: string, positionLine: number): DocstringParts {
    let definition = getDefinition(document, positionLine);
    let body = getBody(document, positionLine)

    let parameterTokens = tokenizeDefinition(definition)
    let functionName = getFunctionName(definition)

    return parseParameters(parameterTokens, body, functionName)
}

