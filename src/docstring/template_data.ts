import { Argument, Decorator, DocstringParts, Exception, KeywordArgument, Returns } from "../docstring_parts";

export class TemplateData {
    public name: string;
    public decorators: Decorator[];
    public args: Argument[];
    public kwargs: KeywordArgument[];
    public exceptions: Exception[];
    public returns: Returns;

    private includeName: boolean;
    private includeExtendedSummary: boolean;

    constructor(
        docstringParts: DocstringParts, guessTypes: boolean, includeName: boolean, includeExtendedSummary: boolean,
    ) {
        this.name = docstringParts.name;
        this.decorators = docstringParts.decorators;
        this.args = docstringParts.args;
        this.kwargs = docstringParts.kwargs;
        this.exceptions = docstringParts.exceptions;
        this.returns = docstringParts.returns;

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

    public paramsExist(): boolean {
        return this.args.length > 0 || this.kwargs.length > 0;
    }

    public exceptionsExist(): boolean {
        return this.exceptions.length > 0;
    }

    public returnsExist(): boolean {
        return this.returns != undefined;
    }

    private removeTypes(): void {
        for (const arg of this.args) {
            arg.type = undefined;
        }

        for (const kwarg of this.kwargs) {
            kwarg.type = undefined;
        }

        this.returns.type = undefined;
    }

    private addDefaultTypePlaceholders(placeholder: string): void {
        for (const arg of this.args) {
            if (arg.type == undefined) {
                arg.type = placeholder;
            }
        }

        for (const kwarg of this.kwargs) {
            if (kwarg.type == undefined) {
                kwarg.type = placeholder;
            }
        }

        const returns = this.returns;
        if (returns != undefined && returns.type == undefined) {
            returns.type = placeholder;
        }
    }
}
