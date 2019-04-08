import { render } from 'Mustache'

import { DocstringParts, Decorator, Argument, KeywordArgument, Raises, Returns, removeTypes } from '../docstring_parts'


export function generateDocstring(template: string, docstringComponents: DocstringParts): string {
    let snippetString = render(template, templateData)

    var placeholderNumber = 0;
    snippetString = snippetString.replace(/@@@/g, function() {
        return (++placeholderNumber).toString();
    })

    return snippetString
}

function templateData(docstringComponents: DocstringParts): any {
    let templateData = docstringComponents as any
    templateData.placeholder = function () {
        return snippetPlaceholder
    }

    templateData.description = "${@@@:[description]}"
}
