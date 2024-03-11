import { render } from "mustache";
import { DocstringParts } from "../docstring_parts";
import { TemplateData } from "./template_data";
import { dedent } from "ts-dedent";
import { unescape } from "querystring";

enum HTMLUnEscapeChars {
    "&amp;" = "&",
    "&lt;" = "<",
    "&gt;" = ">",
    "&#39;" = "'",
    "&quot;" = '"',
  };

export class DocstringFactory {
    private template: string;
    private quoteStyle: string;

    private startOnNewLine: boolean;
    private includeDescription: boolean;
    private includeName: boolean;
    private guessTypes: boolean;

    constructor(
        template: string,
        quoteStyle = '"""',
        startOnNewLine = false,
        includeDescription = true,
        includeName = false,
        guessTypes = true,
    ) {
        this.quoteStyle = quoteStyle;

        this.startOnNewLine = startOnNewLine;
        this.guessTypes = guessTypes;
        this.includeName = includeName;
        this.includeDescription = includeDescription;

        this.template = template;
    }

    public generateDocstring(docstringParts: DocstringParts, indentation = ""): string {
        const templateData = new TemplateData(
            docstringParts,
            this.guessTypes,
            this.includeName,
            this.includeDescription,
        );

        let docstring = render(this.template, templateData);

        docstring = this.addSnippetPlaceholders(docstring);
        docstring = this.condenseNewLines(docstring);
        docstring = this.condenseTrailingNewLines(docstring);
        docstring = this.commentText(docstring);
        docstring = this.indentDocstring(docstring, indentation);

        docstring = docstring.replace(/&#x?(\w+);/g, (inp: string) => {
            const pattern = /&#x(\w*);/;
            const match = inp.match(pattern);
            if (match == null || match.length < 2) {
                return "<" + inp + ">";
            }
            return unescape("%" + match[1]);
        }); // get all the number encoded ones
        docstring = docstring.replace(/&([a-zA-Z]+);/g, (inp: string) => {
            /**
             * Unescapes escaped HTML characters.
             *
             * Use `String.prototype.replace()` with a regex that matches the characters that need to be unescaped, using a callback function to replace each escaped character instance with its associated unescaped character using a dictionary (object).
             * @param str
             */
            const unescapeHTML = (str: string) => {
            type StringMap<T = string> = { [key: string]: T };
              const htmlUnEscapeReg = new RegExp(
                `${Object.keys(HTMLUnEscapeChars).join("|")}`,
                "g"
              );
              return str.replace(
                htmlUnEscapeReg,
                (tag: string) => (HTMLUnEscapeChars as StringMap<string>)[tag] || tag
              )};
            
            return unescapeHTML(inp);
        }); // get all the name encoded ones

        return docstring;
    }

    public toString(): string {
        return dedent`
        DocstringFactory Configuration
        quoteStyle:
            ${this.quoteStyle}
        startOnNewLine:
            ${this.startOnNewLine}
        guessTypes:
            ${this.guessTypes}
        includeName:
            ${this.includeName}
        includeDescription:
            ${this.includeDescription}
        template:
        ${this.template}
        `;
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

    private commentText(snippet: string): string {
        if (this.startOnNewLine) {
            snippet = "\n" + snippet;
        }

        return this.quoteStyle + snippet + this.quoteStyle;
    }

    private indentDocstring(snippet: string, indentation: string): string {
        const snippetLines = snippet.split("\n");

        snippetLines.forEach((line, index) => {
            if (line !== "") {
                snippetLines[index] = indentation + line;
            }
        });

        return snippetLines.join("\n");
    }
}
