import { guessType } from ".";
import { Argument, Decorator, DocstringParts, Exception, KeywordArgument, Returns, Yields } from "../docstring_parts";

export function parseParameters(parameterTokens: string[], body: string[], functionName: string): DocstringParts {
    return {
        name: functionName,
        decorators: parseDecorators(parameterTokens),
        args: parseArguments(parameterTokens),
        kwargs: parseKeywordArguments(parameterTokens),
        returns: parseReturn(parameterTokens, body),
        yields: parseYields(parameterTokens, body),
        exceptions: parseExceptions(body),
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
        return parseFromBody(body, /return /);
    }

    return returnType;
}

function parseYields(parameters: string[], body: string[]): Yields {
    const parsedYield = parseReturnFromDefinition(parameters);
    const yieldType = parsedYield ? parsedYield.type : undefined;

    // Only return Yields if "yield" keyword was found in body.
    return parseFromBody(body, /yield /, yieldType);
}

function parseReturnFromDefinition(parameters: string[]): Returns | undefined {
    const pattern = /^->\s*([\w\[\], \.]*)/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

        if (match == undefined) {
            continue;
        }

        // Skip "-> None" annotations
        return match[1] === "None" ? undefined : { type: match[1] };
    }

    return undefined;
}

function parseFromBody(body: string[], pattern: RegExp, type: string = undefined): Returns | Yields {
    for (const line of body) {
        const match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        return { type };
    }

    return undefined;
}

function parseExceptions(body: string[]): Exception[] {
    const exceptions: Exception[] = [];
    const pattern = /raise\s+([\w.]+)/;

    for (const line of body) {
        const match = line.match(pattern);

        if (match == undefined) {
            continue;
        }

        exceptions.push({ type: match[1] });
    }

    return exceptions;
}

export function inArray<type>(item: type, array: type[]) {
    return array.some((x) => item === x);
}
