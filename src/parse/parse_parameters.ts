import { Argument, KeywordArgument, DocstringParts, Returns, Raises } from "./interfaces";
import { guessType } from "./guess_types";
import { Decorator } from "./interfaces";


export function parseParameters(parameterTokens: string[], body: string[]): DocstringParts {
    return {
        decorators: parseDecorators(parameterTokens),
        args: parseArguments(parameterTokens),
        kwargs: parseKeywordArguments(parameterTokens),
        returns: parseReturnType(parameterTokens),
        raises: parseRaises(body),
    }
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

function parseReturnType(parameters: string[]): Returns {
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

function parseRaises(body: string[]): Raises[] {
    let raises: Raises[] = [];
    let pattern = /raise\s+([\w.]+)/;

    for (let line of body) {
        let match = line.trim().match(pattern);

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
