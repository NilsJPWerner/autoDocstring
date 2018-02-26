import * as vscode from 'vscode';
import { getDefinition, getBody } from './get_lines'
import { DocstringParts } from './interfaces'
import { parseParameters } from './parse_parameters'
import { tokenizeDefinition } from './tokenize_definition'

export function parse(document: vscode.TextDocument, position: vscode.Position): DocstringParts {
    let definition = getDefinition(document.getText(), position.line);
    let body = getBody(document.getText(), position.line)
    let parameterTokens = tokenizeDefinition(definition)

    return parseParameters(parameterTokens, body)
}

