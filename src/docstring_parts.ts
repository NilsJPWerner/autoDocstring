import dedent from "ts-dedent";

export interface DocstringParts {
    name: string;
    decorators: Decorator[];
    args: Argument[];
    kwargs: KeywordArgument[];
    exceptions: Exception[];
    assertions: Assertion[];
    returns: Returns;
    yields: Yields;
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

export interface Assertion {
    stmt: string;
}

export interface Returns {
    type: string;
}

export interface Yields {
    type: string;
}

export function docstringPartsToString(docstringParts: DocstringParts): string {
    const decoratorsText = docstringParts.decorators.length
        ? docstringParts.decorators.map((decorator) => `${decorator.name}`).join("\n")
        : "N/A";
    const argsText = docstringParts.args.length
        ? docstringParts.args.map((argument) => `${argument.var} ${argument.type}`).join("\n")
        : "N/A";
    const kwargsText = docstringParts.kwargs.length
        ? docstringParts.kwargs.map((arg) => `${arg.var} ${arg.type} ${arg.default}`).join("\n")
        : "N/A";
    const exceptionsText = docstringParts.exceptions.length
        ? docstringParts.exceptions.map((exception) => `${exception.type}`).join("\n")
        : "N/A";
    const assertionsText = docstringParts.assertions.length
        ? docstringParts.assertions.map((assertion) => `${assertion.stmt}`).join("\n")
        : "N/A";
    const returnsText = `${docstringParts.returns?.type ?? "N/A"}`;
    const yieldsText = `${docstringParts.yields?.type ?? "N/A"}`;

    return dedent`
    Docstring parts:
        Name:
            ${docstringParts.name}
        Decorators:
            ${decoratorsText}
        Args:
            ${argsText}
        Kwargs:
            ${kwargsText}
        Exceptions:
            ${exceptionsText}
        Assertions:
            ${assertionsText}
        Returns:
            ${returnsText}
        Yields:
            ${yieldsText}
    `;
}
