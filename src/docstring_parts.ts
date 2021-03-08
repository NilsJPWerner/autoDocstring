export interface DocstringParts {
    name: string;
    decorators: Decorator[];
    args: Argument[];
    kwargs: KeywordArgument[];
    exceptions: Exception[];
    returns: Returns;
    yields: Yields;
    classes: Method[];
    methods: Method[];
    attributes: Attribute[];
}

export interface Decorator {
    name: string;
}

export interface Argument {
    var: string;
    type: string;
}

export interface KeywordArgument {
    default: string;
    var: string;
    type: string;
}

export interface Exception {
    type: string;
}

export interface Returns {
    type: string;
}

export interface Yields {
    type: string;
}

// export interface Class {
//     name: string;
// }

export interface Method {
    name: string;
}

export interface Attribute {
    var: string;
    type: string;
}