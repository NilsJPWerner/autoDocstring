import { getDefinition, getBody } from './get_lines'
import { DocstringParts } from '../docstring_parts'
import { parseParameters } from './parse_parameters'
import { tokenizeDefinition } from './tokenize_definition'

export function parse(document: string, positionLine: number): DocstringParts {
    let definition = getDefinition(document, positionLine);
    let body = getBody(document, positionLine)
    let parameterTokens = tokenizeDefinition(definition)

    return parseParameters(parameterTokens, body)
}

