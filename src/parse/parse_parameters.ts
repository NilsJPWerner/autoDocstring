import { Argument, KeywordArgument, DocstringParts } from "interfaces";
import { guessType } from "./guess_type";
import { Decorator } from "./interfaces";


export function parseParameters(parameters: string[]): DocstringParts {
    return {
        decorators: parseDecorators(parameters),
        args: parseArguments(parameters),
        kwargs: parseKeywordArguments(parameters),
        raises: null,
        returns: null,
    }
}

function parseDecorators(parameters: string[]): Decorator[] {
    let decorators: Decorator[] = [];

    for (let param of parameters) {
        let match = param.trim().match(/^@(\w+)/)

        if (match == null) {
            continue;
        }

        decorators.push({
            name: match[1],
        })
    }

    return decorators
}


function parseArguments(parameters: string[]): Argument[] {
    let args: Argument[] = [];
    let excludedArgs = ['self', 'cls']

    for (let param of parameters) {
        let match = param.trim().match(/^(\w+)/)

        if (match == null || param.includes('=') || inArray(param, excludedArgs)) {
            continue;
        }

        args.push({
            var: match[1],
            type: guessType(param),
        })
    }

    return args
}

function parseKeywordArguments(parameters: string[]): KeywordArgument[] {
    let kwargs: KeywordArgument[] = [];

    for (let param of parameters) {
        let match = param.trim().match(/^(\w+)(?:\s*:[^=]+)?\s*=\s*(.+)/)

        if (match == null) {
            continue;
        }

        kwargs.push({
            var: match[1],
            default: match[2],
            type: guessType(param),
        })
    }

    return kwargs
}


export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}
