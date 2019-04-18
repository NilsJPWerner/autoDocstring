import { render } from "mustache";
import { DocstringParts } from "../docstring_parts";
import { TemplateData } from "./template_data";

export class DocstringFactory {

    private template: string;
    private quoteStyle: string;

    private startOnNewLine: boolean;
    private includeDescription: boolean;
    private includeName: boolean;
    private guessTypes: boolean;

    constructor(
        template: string, quoteStyle = '"""', startOnNewLine = false,
        includeDescription = true, includeName = false, guessTypes = true,
    ) {
        this.quoteStyle = quoteStyle;

        this.startOnNewLine = startOnNewLine;
        this.guessTypes = guessTypes;
        this.includeName = includeName;
        this.includeDescription = includeDescription;

        this.template = template;
    }

    public generateDocstring(docstringParts: DocstringParts, noOpeningQuotes = false): string {
        const templateData = new TemplateData(
            docstringParts, this.guessTypes, this.includeName, this.includeDescription,
        );

        let docstring = render(this.template, templateData);

        docstring = this.addSnippetPlaceholders(docstring);
        docstring = this.condenseNewLines(docstring);
        docstring = this.condenseTrailingNewLines(docstring)
        docstring = this.commentText(docstring, noOpeningQuotes)

        return docstring;
    }

    private addSnippetPlaceholders(snippetString: string): string {
        let placeholderNumber = 0;
        snippetString = snippetString.replace(/@@@/g, () => {
            return (++placeholderNumber).toString();
        });

        return snippetString;
    }

    private condenseNewLines(snippet: string): string {
        return snippet.replace(/\n{3,}/gm, "\n\n");
    }

    private condenseTrailingNewLines(snippet: string): string {
        return snippet.replace(/\n+$/g, "\n");
    }

    private commentText(snippetString: string, noOpeningQuotes: boolean): string {
        if (this.startOnNewLine) {
            snippetString = "\n" + snippetString
        }

        if (noOpeningQuotes) {
            return snippetString + this.quoteStyle;
        } else {
            return this.quoteStyle + snippetString + this.quoteStyle;
        }
    }
}
