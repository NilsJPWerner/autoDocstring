import { DocstringParts, Decorator, Argument, KeywordArgument, Raises, Returns, removeTypes } from '../docstring_parts'
import { render } from 'Mustache'
import { TemplateData } from './template_data'
import { SnippetString } from 'vscode';

export class DocstringFactory {

    private template: string;
    private quoteStyle: string;

    private startOnNewLine: boolean;
    private includeDescription: boolean;
    private includeName: boolean;
    private guessTypes : boolean;

    constructor(template: string, quoteStyle = '"""', startOnNewLine = false, includeDescription = true, includeName = false, guessTypes = true) {
        this.quoteStyle = quoteStyle;

        this.startOnNewLine = startOnNewLine;
        this.guessTypes = guessTypes;
        this.includeName = includeName;
        this.includeDescription = includeDescription;

        this.template = template;
    }

    generateDocstring(docstringParts: DocstringParts, openingQuotes = true): string {
        let templateData = new TemplateData(docstringParts, this.guessTypes, this.includeName, this.includeDescription)

        let docstring = render(this.template, templateData)

        docstring = this.addSnippetPlaceholders(docstring)
        if (this.startOnNewLine) { docstring = "\n" + docstring }
        docstring = this.condenseNewLines(docstring)

        return this.commentText(docstring, openingQuotes);
    }

    private addSnippetPlaceholders(snippetString: string): string {
        var placeholderNumber = 0;
        snippetString = snippetString.replace(/@@@/g, function() {
            return (++placeholderNumber).toString();
        })

        return snippetString
    }

    private condenseNewLines(snippet: string): string {
        return snippet.replace(/\n{3,}/gm, "\n\n")
    }

    private commentText(snippetString: string, openingQuotes: boolean): string {
        if (openingQuotes) {
            return this.quoteStyle + snippetString + this.quoteStyle;
        } else {
            return snippetString + this.quoteStyle;
        }
    }
}
