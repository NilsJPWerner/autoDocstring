import chai = require('chai');
import 'mocha';
import { DocstringFactory } from "../../src/docstring/docstring_factory";
import { DocstringParts } from '../../src/docstring_parts';
import { guessType } from 'parse/guess_types';
import { docstringIsClosed } from 'parse/closed_docstring';


chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('DocstringFactory', () => {

    describe('generateDocstring()', () => {
        context("when instantiated with a template with placeholder tags", () => {
            it("should add numerically increasing snippet placeholders", () => {
                let template = "{{#placeholder}}first{{/placeholder}}\n{{#placeholder}}second{{/placeholder}}"
                let docstringComponents = defaultDocstringComponents

                let factory = new DocstringFactory(template)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"${1:first}\n${2:second}\"\"\"");
            });

            it("should use docstring components in the placeholders", () => {
                let template = "{{#placeholder}}--{{name}}--{{/placeholder}}"
                let docstringComponents = defaultDocstringComponents
                docstringComponents.name = "Function"

                let factory = new DocstringFactory(template)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"${1:--Function--}\"\"\"");
            });
        });

        //     context("when values in the docstring components are undefined", () => {

        //     })

        context("when a non existent field is used in the template", () => {
            it("should ignore the tag", () => {
                let template = "{{name}} {{notavalidtag}} hello"
                let docstringComponents = defaultDocstringComponents
                docstringComponents.name = "Function"
                let factory = new DocstringFactory(template)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"Function  hello\"\"\"");
            })
        })

        it("should use the docstring name if the template specifies it", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.name = "Function"
            let factory = new DocstringFactory(nameTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Function abc\"\"\"");
        })


        it("should iterate over docstring decorators", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.decorators = [
                { name: "decorator_1" },
                { name: "decorator_2" },
            ]
            let factory = new DocstringFactory(decoratorTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"decorator_1\ndecorator_2\n\"\"\"");
        })

        it("should iterate over docstring args", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.args = [
                { var: "arg_1", type: "string" },
                { var: "arg_2", type: "number" },
            ]
            let factory = new DocstringFactory(argTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"arg_1 string\narg_2 number\n\"\"\"");
        })

        it("should iterate over docstring kwargs", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.kwargs = [
                { var: "kwarg_1", type: "string", default: "1" },
                { var: "kwarg_2", type: "number", default: "text" },
            ]
            let factory = new DocstringFactory(kwargTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"kwarg_1 string 1\nkwarg_2 number text\n\"\"\"");
        })

        it("should iterate over docstring raises components", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.raises = [
                { exception: "Error_1" },
                { exception: "Error_2" },
            ]
            let factory = new DocstringFactory(raisesTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Error_1\nError_2\n\"\"\"");
        })

        it("should use the docstring returns if the template specifies it", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.returns = { type: "Thing" }
            let factory = new DocstringFactory(returnsTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"Thing yay\"\"\"");
        })

        it("should remove extraneous newlines if a component is unused", () => {
            let docstringComponents = defaultDocstringComponents
            docstringComponents.kwargs = []
            docstringComponents.args = []
            let factory = new DocstringFactory(unusedComponentsTemplate)

            let result = factory.generateDocstring(docstringComponents);

            expect(result).to.equal("\"\"\"[summary]\n\nHello\n\nAgain!\"\"\"");
        })

        context("when guessTypes is set to false", () => {
            it("should not use the types from the docstring", () => {
                let docstringComponents = defaultDocstringComponents
                docstringComponents.args = [{ var: "arg_1", type: "string" }]
                docstringComponents.kwargs = [{ var: "kwarg_1", type: "string", default: "abc" }]
                docstringComponents.returns = { type: "Thing" }

                let factory = new DocstringFactory(noTypesTemplate, undefined, undefined, undefined, undefined, false)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"arg_1 [type]\nkwarg_1 [type]\nreturns [type]\"\"\"");
            })
        })

        context("when quoteStyle is set to ''' ", () => {
            it("should wrap the returned snippet in '''", () => {
                let template = "{{name}} hello"
                let docstringComponents = defaultDocstringComponents
                docstringComponents.name = "Function"
                let factory = new DocstringFactory(template, "'''")

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("'''Function hello'''");
            })
        })

        context("when startOnNewLine is set to true", () => {
            it("should add a new line at the beginning of the docstring", () => {
                let template = "{{name}} hello"
                let docstringComponents = defaultDocstringComponents
                docstringComponents.name = "Function"
                let factory = new DocstringFactory(template, undefined, true)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"\nFunction hello\"\"\"");
            })
        })

        context("when includeDescription is set to true", () => {
            it("should add the description placeholder to the snippet", () => {
                let template = "{{summary}}\n\n{{description}}\n\nHello"
                let docstringComponents = defaultDocstringComponents
                docstringComponents.name = "Function"
                let factory = new DocstringFactory(template, undefined, undefined, true)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"[summary]\n\n[description]\n\nHello\"\"\"");
            })
        })

        context("when includeDescription is set to false", () => {
            it("should not add the description placeholder to the snippet and should remove extraneous newlines", () => {
                let template = "{{summary}}\n\n{{description}}\n\nHello"
                let docstringComponents = defaultDocstringComponents
                docstringComponents.name = "Function"
                let factory = new DocstringFactory(template, undefined, undefined, false)

                let result = factory.generateDocstring(docstringComponents);

                expect(result).to.equal("\"\"\"[summary]\n\nHello\"\"\"");
            })
        })
    })
})

let defaultDocstringComponents: DocstringParts = {
    name: "",
    decorators: [],
    args: [],
    kwargs: [],
    returns: { type: "" },
    raises: [],
}


let nameTemplate = `{{name}} abc`

let decoratorTemplate = `{{#decorators}}
{{name}}
{{/decorators}}`

let argTemplate = `{{#args}}
{{var}} {{type}}
{{/args}}`

let kwargTemplate = `{{#kwargs}}
{{var}} {{type}} {{default}}
{{/kwargs}}`

let raisesTemplate = `{{#raises}}
{{exception}}
{{/raises}}`

let returnsTemplate = `{{returns.type}} yay`

let unusedComponentsTemplate = `{{summary}}

{{#kwargs}}
{{var}} {{type}} {{default}}
{{/kwargs}}

Hello

{{#args}}
{{var}} {{type}}
{{/args}}

Again!`

let noTypesTemplate = `{{#args}}{{var}} {{type}}{{/args}}
{{#kwargs}}{{var}} {{type}}{{/kwargs}}
returns {{returns.type}}`
