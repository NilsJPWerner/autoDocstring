import * as vscode from 'vscode';
import { getDefinition, getBody } from './get_lines'
import { DocstringParts } from './interfaces'
import { parseParameters } from './parse_function'
import { tokenizeDefinition } from './tokenize_definition'

export function parse(document: vscode.TextDocument, position: vscode.Position): DocstringParts {
    let definition = getDefinition(document, position);
    let body = getBody(document, position)
    let parameterTokens = tokenizeDefinition(definition)

    return parseParameters(parameterTokens, body)
}

