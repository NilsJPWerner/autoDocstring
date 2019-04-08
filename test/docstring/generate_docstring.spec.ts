import chai = require('chai');
import 'mocha';
import { DocstringParts } from '../../src/docstring_parts'

import { generateDocstring } from "../../src/docstring/generate_docstring"

chai.config.truncateThreshold = 0;
let expect = chai.expect;


// describe('generateDocstring()', () => {
//     context("when passed a template with placeholder tags", () => {
//         it("adds numerically increasing snippet placeholders", () => {
//             let template = "{{#placeholder}}first{{/placeholder}}\n{{#placeholder}}second{{/placeholder}}"
//             let docstringComponents = defaultDocstringComponents

//             let result = generateDocstring(template, docstringComponents);

//             expect(result).to.equal("${1:first}\n${2:second}");
//         });

//         it("uses docstring components in the placeholders", () => {
//             let template ="{{#placeholder}}--{{name}}--{{/placeholder}}"
//             let docstringComponents = defaultDocstringComponents
//             docstringComponents.name = "Function"

//             let result = generateDocstring(template, docstringComponents);

//             expect(result).to.equal("${1:--Function--}");
//         });
//     });

//     context("when values in the docstring components are undefined", () => {

//     })

//     context("when a non existant field is used in the template", () => {
//         it("ignores the tag", () => {
//             let template = "{{name}} {{notavalidtag}} hello"
//             let docstringComponents = defaultDocstringComponents
//             docstringComponents.name = "Function"

//             let result = generateDocstring(template, docstringComponents);

//             expect(result).to.equal("Function  hello");
//         })
//     })

//     it("uses the docstring name if the template specifies it", () => {
//         let docstringComponents = defaultDocstringComponents
//         docstringComponents.name = "Function"

//         let result = generateDocstring(nameTemplate, docstringComponents);

//         expect(result).to.equal("Function abc");
//     })

//     it("iterates over docstring decorators", () => {
//         let docstringComponents = defaultDocstringComponents
//         docstringComponents.decorators = [
//             { name: "decorator_1" },
//             { name: "decorator_2" },
//         ]

//         let result = generateDocstring(decoratorTemplate, docstringComponents);

//         expect(result).to.equal("decorator_1\ndecorator_2\n");
//     })

//     it("iterates over docstring args", () => {
//         let docstringComponents = defaultDocstringComponents
//         docstringComponents.args = [
//             { var: "arg_1", type: "string" },
//             { var: "arg_2", type: "number" },
//         ]

//         let result = generateDocstring(argTemplate, docstringComponents);

//         expect(result).to.equal("arg_1 string\narg_2 number\n");
//     })

//     it("iterates over docstring kwargs", () => {
//         let docstringComponents = defaultDocstringComponents
//         docstringComponents.kwargs = [
//             { var: "kwarg_1", type: "string", default: "1" },
//             { var: "kwarg_2", type: "number", default: "text" },
//         ]

//         let result = generateDocstring(kwargTemplate, docstringComponents);

//         expect(result).to.equal("kwarg_1 string 1\nkwarg_2 number text\n");
//     })

//     it("iterates over dosctring raises components", () => {
//         let docstringComponents = defaultDocstringComponents
//         docstringComponents.raises = [
//             { exception: "Error_1" },
//             { exception: "Error_2" },
//         ]

//         let result = generateDocstring(raisesTemplate, docstringComponents);

//         expect(result).to.equal("Error_1\nError_2\n");
//     })

//     it("uses the docstring returns if the template specifies it", () => {
//         let docstringComponents = defaultDocstringComponents
//         docstringComponents.returns = { type: "Thing" }

//         let result = generateDocstring(returnsTemplate, docstringComponents);

//         expect(result).to.equal("Thing yay");
//     })
// });

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
