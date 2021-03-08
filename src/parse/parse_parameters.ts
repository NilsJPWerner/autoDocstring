import { guessType } from ".";
import { indentationOf } from "./utilities";
import { getFunctionName } from "./get_function_name";
import { 
    Argument,
    Decorator,
    DocstringParts,
    Exception,
    KeywordArgument,
    Returns,
    Yields,
    Method,
    Attribute
} from "../docstring_parts";

function parseMethod(
    parameterTokens: string[],
    body: string[],
    functionName: string): DocstringParts {
        return {
            name: functionName,
            decorators: parseDecorators(parameterTokens),
            args: parseArguments(parameterTokens),
            kwargs: parseKeywordArguments(parameterTokens),
            returns: parseReturn(parameterTokens, body),
            yields: parseYields(parameterTokens, body),
            exceptions: parseExceptions(body),
            classes: [],
            methods: [],
            attributes: []
        };
}

function parseClass(
    parameterTokens: string[],
    body: string[],
    functionName: string): DocstringParts {
        let args = parseArguments(parameterTokens);
        let kwargs = parseKeywordArguments(parameterTokens);
        return {
            name: functionName,
            decorators: parseDecorators(parameterTokens),
            args: args,
            kwargs: kwargs,
            returns: undefined,
            yields: undefined,
            exceptions: [],
            classes: [],
            methods: [],
            attributes: parseAttributes(body, args, kwargs)
        };
}

function parseModule(
    body: string[],
    functionName: string): DocstringParts {
        return {
            name: functionName,
            decorators: [],
            args: [],
            kwargs: [],
            returns: undefined,
            yields: undefined,
            exceptions: [],
            classes: parseMethods(body, /(?:class)\s/),
            methods: parseMethods(body, /(def)\s+(\w+)\s*\(/),
            attributes: []
        };
}

export function parseParameters(
    docstringType: string,
    parameterTokens: string[],
    body: string[],
    functionName: string): DocstringParts {

    if (docstringType === "module") {
        return parseModule(body, functionName);
    }
    else if (docstringType === "method") {
        return parseMethod(parameterTokens, body, functionName);
    }
    else if (docstringType === "class") {
        return parseClass(parameterTokens, body, functionName);
    };
}

function parseDecorators(parameters: string[]): Decorator[] {
    const decorators: Decorator[] = [];
    const pattern = /^@(\w+)/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

        if (match == null) {
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

        if (match == null || param.includes("=") || inArray(param, excludedArgs)) {
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

        if (match == null) {
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

    if (returnType == null || isIterator(returnType.type)) {
        return parseFromBody(body, /return /);
    }

    return returnType;
}

function parseYields(parameters: string[], body: string[]): Yields {
    const returnType = parseReturnFromDefinition(parameters);

    if (returnType != null && isIterator(returnType.type)) {
        return returnType as Yields;
    }

    // To account for functions that yield but don't have a yield signature
    const yieldType = returnType ? returnType.type : undefined;
    const yieldInBody = parseFromBody(body, /yield /);

    if (yieldInBody != null && yieldType != undefined) {
        yieldInBody.type = `Iterator[${yieldType}]`;
    }

    return yieldInBody;
}

function parseReturnFromDefinition(parameters: string[]): Returns | null {
    const pattern = /^->\s*(["']?)([\w\[\], \.]*)\1/;

    for (const param of parameters) {
        const match = param.trim().match(pattern);

        if (match == null) {
            continue;
        }

        // Skip "-> None" annotations
        return match[2] === "None" ? null : { type: match[2] };
    }

    return null;
}

function parseExceptions(body: string[]): Exception[] {
    const exceptions: Exception[] = [];
    const pattern = /(?<!#.*)raise\s+([\w.]+)/;

    for (const line of body) {
        const match = line.match(pattern);

        if (match == null) {
            continue;
        }

        exceptions.push({ type: match[1] });
    }

    return exceptions;
}

function parseMethods(body: string[], pattern: RegExp): Method[] {
    const methods: Method[] = []
    // const pattern = /(def)\s+(\w+)\s*\(/;
    // const pattern = /\b(((async\s+)?\s*def)|\s*class)\b/g;

    for (const line of body) {

        const match = line.match(pattern);
        if (indentationOf(line) === 0 && match != null) {
            methods.push({
                name: getFunctionName(line),
            });
        }
    }
    return methods;
}

function parseAttributes(body: string[], args: Argument[], kwargs: KeywordArgument[]): Attribute[] {
    const attributes: Attribute[] = [];
    const pattern = /(?:self\.|cls\.)(\w+)(?:\s*:[^=]+)?\s*=\s*(.+)/;
    //const pattern = /(?:self).(\w+)?\s*/

    for (const line of body) {
        const match = line.trim().match(pattern);

        if (match == null) {
            continue;
        }
        let var_ = match[1];
        let type_ = guessType(match[1]);
        if (!containsAttribute(attributes, var_) && !containsAttribute(args, var_) && !containsAttribute(kwargs, var_)) {
            attributes.push({
                var: var_,
                type: type_
            });
        }
    }

    return attributes;
}

export function inArray<type>(item: type, array: type[]) {
    return array.some((x) => item === x);
}

function parseFromBody(body: string[], pattern: RegExp): Returns | Yields {
    for (const line of body) {
        const match = line.match(pattern);

        if (match == null) {
            continue;
        }

        return { type: undefined };
    }

    return undefined;
}

/**
 * Check whether the annotated type is an iterator.
 * @param type The annotated type
 */
function isIterator(type: string): boolean {
    return type.startsWith("Generator") || type.startsWith("Iterator");
}

function containsAttribute(attributes: Attribute[], name: string): boolean {
    for (const attribute of attributes) {
        if (attribute.var === name) {
            return true;
        }
    }
    return false;
}
