import { DocstringParts, Decorator, Argument, KeywordArgument, Raises, Returns, removeTypes } from '../docstring_parts'

export class TemplateData {
    name: string;
    decorators: Decorator[];
    args: Argument[];
    kwargs: KeywordArgument[];
    raises: Raises[];
    returns: Returns;

    includeName: boolean
    includeDescription: boolean

    constructor(docstringParts: DocstringParts, guessTypes: boolean, includeName: boolean, includeDescription: boolean) {
        this.name = docstringParts.name
        this.decorators = docstringParts.decorators
        this.args = docstringParts.args
        this.kwargs = docstringParts.kwargs
        this.raises = docstringParts.raises
        this.returns = docstringParts.returns

        this.includeName = includeName
        this.includeDescription = includeDescription

        if (!guessTypes) {
            this.removeTypes()
        }

        this.addDefaultTypePlaceholders("[type]")
    }

    placeholder() {
        return function (text: string, render: (text: string) => string) {
            return "${@@@:" + render(text) + "}";
        }
    }

    summary(): string {
        if (this.includeName) {
            return this.name + " ${@@@:[summary]}"
        }

        return "${@@@:[summary]}"
    }

    description(): string {
        if (this.includeDescription) {
            return "${@@@:[description]}"
        }

        return ""
    }

    private removeTypes(): void {
        for (let arg of this.args) {
            arg.type = undefined
        }

        for (let kwarg of this.kwargs) {
            kwarg.type = undefined
        }

        this.returns.type = undefined
    }

    private addDefaultTypePlaceholders(placeholder: string): void {
        for (let arg of this.args) {
            if (arg.type == undefined) {
                arg.type = placeholder
            }
        }

        for (let kwarg of this.kwargs) {
            if (kwarg.type == undefined) {
                kwarg.type = placeholder
            }
        }

        let returns = this.returns;
        if (returns != undefined && returns.type == undefined) {
            returns.type = placeholder
        }
    }
}
