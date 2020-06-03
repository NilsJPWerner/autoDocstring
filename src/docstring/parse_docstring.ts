// import { reverseMustache } from "reverse-mustache";
// const reverseMustache = require("reverse-mustache");
import { diffLines } from "Diff";
import { Argument, DocstringParts } from "../docstring_parts";

// Need to deal with 1. multiline regex 2. indentation 3. description 4. check crlf
// 5. sections in different orders 6. A section is not there

export function parseDocstring(oldDocstring: string, template: string) {
    const docstringLines = oldDocstring.split("\n");
    const templateLines = template.split("\n");

    const argRegex = getBlockRegex(template, "args");
    const kwargRegex = getBlockRegex(template, "kwargs");
    const exceptionRegex = getBlockRegex(template, "exceptions");
    const returnRegex = getBlockRegex(template, "returns");
    const yieldRegex = getBlockRegex(template, "yields");

    console.log(yieldRegex);

    const argRegexLineCount = argRegex.toString().split("\\n").length;
    const kwargRegexLineCount = kwargRegex.toString().split("\\n").length;
    const exceptionRegexLineCount = exceptionRegex.toString().split("\\n").length;
    const returnRegexLineCount = returnRegex.toString().split("\\n").length;
    const yieldRegexLineCount = yieldRegex.toString().split("\\n").length;

    const docstringParts = emptyDocstringParts();

    let j = 0;
    for (let i = 0; i < templateLines.length; i++) {
        // Advance docstring and template if lines match
        if (templateLines[i] == docstringLines[j]) {
            j++;
            continue;
        }

        // Start parsing args if the start arg block is reached
        if (/{{#args}}/.test(templateLines[i])) {
            // Keep parsing arg lines until lines no longer match arg regex or they match kwarg pattern
            while (j <= docstringLines.length) {
                const lines = docstringLines.slice(j, j + argRegexLineCount).join("\n");

                if (!argRegex.test(lines) || kwargRegex.test(lines)) {
                    break;
                }

                const match = lines.match(argRegex);
                docstringParts.args.push({
                    var: match.groups.var,
                    type: match.groups.type,
                });

                j += argRegexLineCount;
            }

            // Advance to end of arg block
            while (!/{{\/args}}/.test(templateLines[i]) && i < templateLines.length) {
                i++;
            }
        }

        // Start parsing kwargs if the start kwarg block is reached
        if (/{{#kwargs}}/.test(templateLines[i])) {
            while (j <= docstringLines.length) {
                const lines = docstringLines.slice(j, j + kwargRegexLineCount).join("\n");

                if (!kwargRegex.test(lines)) {
                    break;
                }

                const match = lines.match(kwargRegex);
                docstringParts.kwargs.push({
                    var: match.groups.var,
                    type: match.groups.type,
                    default: match.groups.default,
                });

                j += kwargRegexLineCount;
            }

            // Advance to end of kwarg block
            while (!/{{\/kwargs}}/.test(templateLines[i]) && i < templateLines.length) {
                i++;
            }
        }

        if (/{{#exceptions}}/.test(templateLines[i])) {
            while (j <= docstringLines.length) {
                const lines = docstringLines.slice(j, j + exceptionRegexLineCount).join("\n");

                if (!exceptionRegex.test(lines)) {
                    break;
                }

                const match = lines.match(exceptionRegex);
                docstringParts.exceptions.push({
                    type: match.groups.type,
                });

                j += exceptionRegexLineCount;
            }

            // Advance to end of kwarg block
            while (!/{{\/exceptions}}/.test(templateLines[i]) && i < templateLines.length) {
                i++;
            }
        }

        if (/{{#returns}}/.test(templateLines[i])) {
            while (j <= docstringLines.length) {
                const lines = docstringLines.slice(j, j + returnRegexLineCount).join("\n");
                console.log(lines);
                if (!returnRegex.test(lines)) {
                    break;
                }

                const match = lines.match(returnRegex);
                docstringParts.returns = {
                    type: match.groups.type,
                };

                j += returnRegexLineCount;
            }

            // Advance to end of kwarg block
            while (!/{{\/returns}}/.test(templateLines[i]) && i < templateLines.length) {
                i++;
            }
        }

        if (/{{#yields}}/.test(templateLines[i])) {
            while (j <= docstringLines.length) {
                const lines = docstringLines.slice(j, j + yieldRegexLineCount).join("\n");
                console.log(lines);
                if (!yieldRegex.test(lines)) {
                    break;
                }

                const match = lines.match(yieldRegex);
                docstringParts.yields = {
                    type: match.groups.type,
                };

                j += yieldRegexLineCount;
            }

            // Advance to end of kwarg block
            while (!/{{\/yields}}/.test(templateLines[i]) && i < templateLines.length) {
                i++;
            }
        }
    }

    console.log(docstringParts);
}

function getBlockRegex(template: string, block: string): RegExp {
    const blockStartTag = `{{#${block}}}`;
    const blockEndTag = `{{/${block}}}`;
    const blockRegex = new RegExp(blockStartTag + "(.*)" + blockEndTag, "s");

    const match = template.match(blockRegex);
    let pattern = match[1];

    // Escape all characters that can be misidentified in regex
    pattern = escapeRegExp(pattern);

    // Replace all tags with named regex capture groups
    pattern = replaceTags(pattern, "{{var}}", "\\w+", "var");
    pattern = replaceTags(pattern, "{{typePlaceholder}}", "[\\w\\[\\], ]+", "type");
    pattern = replaceTags(pattern, "{{descriptionPlaceholder}}", ".*", "description");
    pattern = replaceTags(pattern, "{{&default}}", ".+", "default");
    pattern = replaceTags(pattern, "{{type}}", "\\w+", "type");

    pattern = pattern.trim();
    pattern = pattern.replace(/\n/g, "\\n\\s*");

    return new RegExp(pattern.trim());
}

function replaceTags(str: string, tag: string, pattern: string, captureGroupName: string): string {
    tag = escapeRegExp(tag);
    str = str.replace(tag, `(?<${captureGroupName}>${pattern})`);

    // Replace remaining matches with non capturing pattern
    while (new RegExp(escapeRegExp(tag)).test(str)) {
        str = str.replace(tag, pattern);
    }

    return str;
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function emptyDocstringParts(): DocstringParts {
    return {
        name: "",
        args: [],
        kwargs: [],
        decorators: [],
        exceptions: [],
        yields: null,
        returns: null,
    };
}
