import { Argument, Decorator, DocstringParts, KeywordArgument, Raises, Returns } from "../docstring_parts";
import { guessType } from "./guess_types";

export function parseParameters(parameterTokens: string[], body: string[], functionName: string): DocstringParts {
    return {
        name: functionName,
        decorators: parseDecorators(parameterTokens),
        args: parseArguments(parameterTokens),
        kwargs: parseKeywordArguments(parameterTokens),
        returns: parseReturn(parameterTokens, body),
        raises: parseRaises(body),
    };
}

function parseDecorators(parameters: string[]): Decorator[] {
    const decorators: Decorator[] = [];
    const pattern = /^@(\w+)/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        decorators.push({
            name: match[1],
        });
    }

    return decorators;
}

function parseArguments(parameters: string[]): Argument[] {
    const args: Argument[] = [];
    const excludedArgs = ["self", "cls"];
    const pattern = /^(\w+)/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

        if (match == undefined || param.includes("=") || inArray(param, excludedArgs)) {
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
    const kwargs: KeywordArgument[] = [];
    const pattern = /^(\w+)(?:\s*:[^=]+)?\s*=\s*(.+)/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

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
    const returnType = parseReturnFromDefinition(parameters);

    if (returnType == undefined) {
        return parseReturnFromBody(body);
    }

    return returnType;
}

function parseReturnFromDefinition(parameters: string[]): Returns {
    const pattern = /^->\s*([\w\[\], \.]*)/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type: match[1] };
    }

    return undefined;
}

function parseReturnFromBody(body: string[]): Returns {
    const pattern = /return /;

    for (const line of body) {
        const match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type: undefined };
    }

    return undefined;
}

function parseRaises(body: string[]): Raises[] {
    const raises: Raises[] = [];
    const pattern = /raise\s+([\w.]+)/;

    for (const line of body) {
        const match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        raises.push({ exception: match[1] });
    }

    return raises;
}

export function inArray<type>(item: type, array: type[]) {
    return array.some((x) => item === x);
}
