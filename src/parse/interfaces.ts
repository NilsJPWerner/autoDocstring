export interface DocstringParts {
    decorators: Decorator[];
    args: Argument[];
    kwargs: KeywordArgument[];
    raises: Raises[];
    returns: Returns;
}

export interface Decorator {
    name: string;
}

export interface Argument {
    var: string;
    type: string;
}

export interface KeywordArgument extends Argument {
    default: string;
}

export interface Raises {
    error: string;
}

export interface Returns {
    return_type: string;
    value_type: string;
}

