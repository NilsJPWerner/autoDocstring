import * as vscode from 'vscode';

export interface Argument {
    var: string;
    type: string;
}

export interface KeywordArgument extends Argument {
    default: string;
}

export interface Decorator {
    name: string;
}

export interface DocstringParts {
    args: Argument[];
    kwargs: KeywordArgument[];
    decorators: Decorator[];
}
