import { Argument, KeywordArgument, DocstringParts, Returns, Raises, Decorator } from "../docstring_parts";
import { guessType } from "./guess_types";

//change by snakeclub: add para definition, fix parseDecorators bug, and add defType return
export function parseParameters(parameterTokens: string[], body: string[], functionName: string, definition: string): DocstringParts {
    return {
        defType: parseDefType(definition),
        name: functionName,
        decorators: parseDecorators(definition.split("\n")),
        args: parseArguments(parameterTokens),
        kwargs: parseKeywordArguments(parameterTokens),
        returns: parseReturn(parameterTokens, body),
        raises: parseRaises(body),
    }
}
//add by snakeclub: get defType
function parseDefType(definition) {
    let lines: string[] = definition.split("\n");
    let pattern = /^(def|class)(?= \w+)/;
    for (let line of lines) {
        let match = line.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        return match[0];
    }
    return "";
}
function parseDecorators(parameters: string[]): Decorator[] {
    let decorators: Decorator[] = [];
    let pattern = /^@(\w+)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        decorators.push({
            name: match[1],
        })
    }

    return decorators;
}

function parseArguments(parameters: string[]): Argument[] {
    let args: Argument[] = [];
    let excludedArgs = ['self', 'cls'];
    let pattern = /^(\w+)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined || param.includes('=') || inArray(param, excludedArgs)) {
            continue;
        }

        args.push({
            var: match[1],
            type: guessType(param),
        });
    }

    return args;
}

function parseKeywordArguments(parameters: string[]): KeywordArgument[] {
    let kwargs: KeywordArgument[] = [];
    let pattern = /^(\w+)(?:\s*:[^=]+)?\s*=\s*(.+)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        kwargs.push({
            var: match[1],
            default: match[2],
            type: guessType(param),
        });
    }

    return kwargs;
}

function parseReturn(parameters: string[], body: string[]): Returns {
    let returnType = parseReturnFromDefinition(parameters);

    if (returnType == undefined) {
        return parseReturnFromBody(body);
    }

    return returnType;
}

function parseReturnFromDefinition(parameters: string[]): Returns {
    let pattern = /^->\s*([\w\[\], \.]*)/;

    for (let param of parameters) {
        let match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type: match[1] };
    }

    return undefined
}

function parseReturnFromBody(body: string[]): Returns {
    let pattern = /return /

    for (let line of body) {
        let match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type: undefined };
    }

    return undefined
}

function parseRaises(body: string[]): Raises[] {
    let raises: Raises[] = [];
    let pattern = /raise\s+([\w.]+)/;

    for (let line of body) {
        let match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        raises.push({ exception: match[1] });
    }

    return raises;
}


export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}
