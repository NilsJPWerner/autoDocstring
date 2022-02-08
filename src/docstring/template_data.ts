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


export class TemplateData {
    public name: string;
    public decorators: Decorator[];
    public args: Argument[];
    public kwargs: KeywordArgument[];
    public exceptions: Exception[];
    public returns: Returns;
    public yields: Yields;
    public classes: Method[];
    public methods: Method[];
    public attributes: Attribute[];

    private includeName: boolean;
    private includeExtendedSummary: boolean;

    constructor(
        docstringParts: DocstringParts,
        guessTypes: boolean,
        includeName: boolean,
        includeExtendedSummary: boolean,
    ) {
        this.name = docstringParts.name;
        this.decorators = docstringParts.decorators;
        this.args = docstringParts.args;
        this.kwargs = docstringParts.kwargs;
        this.exceptions = docstringParts.exceptions;
        this.returns = docstringParts.returns;
        this.yields = docstringParts.yields;
        this.classes = docstringParts.classes;
        this.methods = docstringParts.methods;
        this.attributes = docstringParts.attributes;

        this.includeName = includeName;
        this.includeExtendedSummary = includeExtendedSummary;

        if (!guessTypes) {
            this.removeTypes();
        }

        this.addDefaultTypePlaceholders("[type]");
    }

    public placeholder() {
        return (text: string, render: (text: string) => string) => {
            return "${@@@:" + render(text) + "}";
        };
    }

    public summaryPlaceholder(): string {
        if (this.includeName) {
            return this.name + " ${@@@:[summary]}";
        }

        return "${@@@:[summary]}";
    }

    public extendedSummaryPlaceholder(): string {
        if (this.includeExtendedSummary) {
            return "${@@@:[extended_summary]}";
        }

        return "";
    }

    public typePlaceholder(): string {
        // @ts-ignore
        return "${@@@:" + this.type + "}";
    }

    public descriptionPlaceholder(): string {
        return "${@@@:[description]}";
    }

    public argsExist(): boolean {
        return this.args.length > 0;
    }

    public kwargsExist(): boolean {
        return this.kwargs.length > 0;
    }

    public parametersExist(): boolean {
        return this.args.length > 0 || this.kwargs.length > 0;
    }

    public exceptionsExist(): boolean {
        return this.exceptions.length > 0;
    }

    public returnsExist(): boolean {
        return this.returns !== undefined;
    }

    public yieldsExist(): boolean {
        return this.yields != undefined;
    }

    public classesExist(): boolean {
        return this.classes.length > 0;
    }

    public methodsExist(): boolean {
        return this.methods.length > 0;
    }

    public attributesExist(): boolean {
        return this.attributes.length > 0;
    }

    private removeTypes(): void {
        for (const arg of this.args) {
            arg.type = undefined;
        }

        for (const kwarg of this.kwargs) {
            kwarg.type = undefined;
        }

        if (this.yieldsExist()) {
            this.yields.type = undefined;
        }

        if (this.returnsExist()) {
            this.returns.type = undefined;
        }
    }

    private addDefaultTypePlaceholders(placeholder: string): void {
        for (const arg of this.args) {
            if (arg.type === undefined) {
                arg.type = placeholder;
            }
        }

        for (const kwarg of this.kwargs) {
            if (kwarg.type === undefined) {
                kwarg.type = placeholder;
            }
        }

        const returns = this.returns;
        if (returns !== undefined && returns.type === undefined) {
            returns.type = placeholder;
        }

        const yields = this.yields;
        if (yields != undefined && yields.type == undefined) {
            yields.type = placeholder;
        }

        for (const attribute of this.attributes) {
            if (attribute.type === undefined) {
                attribute.type = placeholder;
            }
        }
    }
}
