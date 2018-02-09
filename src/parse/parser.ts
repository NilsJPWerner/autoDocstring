import * as vscode from 'vscode';
// import { Argument, KeywordArgument, Decorator, Raises, Returns, DocstringParts } from './interfaces';

export class Parser {

}

export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}

export function includesFromArray(string: string, substrings: string[]) {
    substrings.some(x => string.includes(x))
}
