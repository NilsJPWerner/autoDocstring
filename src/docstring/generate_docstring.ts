import { DocstringParts } from '../docstring_parts'
import { render } from 'Mustache'

export function generateDocstring(template: string, docstringComponents: DocstringParts): string {
    let templateData = docstringComponents as any
    templateData.placeholder = function () {
        return function (text: string, render: (text: string) => string) {
            return "${@@@:" + render(text) + "}";
        }
    }

    let snippetString = render(template, templateData)

    var placeholderNumber = 0;
    snippetString = snippetString.replace(/@@@/g, function() {
        return (++placeholderNumber).toString();
    })

    return snippetString
}
