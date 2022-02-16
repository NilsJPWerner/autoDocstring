import chai = require("chai");
import "mocha";
import dedent from "ts-dedent";

import { parseDocstring, getTemplate } from "../../docstring";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

it.only("Full google docstring", () => {
    const fullGoogleDocstring = dedent`
    Args:
        arg1 ([type]): An argument. It is named arg1
        arg2 (Dict[str, int]): This is also an argument => a good one!
        kwarg1 (int, optional): a kwarg this time. A really good one. Defaults to 1.

    Raises:
        FileExistsError: Oh nej!
        KeyError: bad things!

    Returns:
        [type]: [description]

    Yields:
        [type]: [description]
    """`;

    // const template = getTemplate("google");
    // parseDocstring(googleDocstring, template);

    // parseDocstring("world", "{{#place}}{{name}}{{/place}}");
    const docstring = parseDocstring(fullGoogleDocstring, googleTemplate);

    expect(docstring).to.eql({
        name: "",
        args: [{ var: "arg1", type: "[type]" }, { var: "arg2" }],
        kwargs: [{ var: "kwarg1", type: "int", default: "1" }],
        decorators: [],
        exceptions: [{ type: "FileExistsError" }, { type: "KeyError" }],
        yields: { type: "[type]" },
        returns: { type: "[type]" },
    });
});

it("parses a google docstring with no args", () => {
    const noArgsGoogleDocstring = dedent`
    Args:
        kwarg1 (int, optional): a kwarg this time. A really good one. Defaults to 1.

    Raises:
        FileExistsError: Oh nej!
        KeyError: bad things!

    Returns:
        [type]: [description]

    Yields:
        [type]: [description]
    """`;

    const docstring = parseDocstring(noArgsGoogleDocstring, googleTemplate);

    expect(docstring).to.eql({
        name: "",
        args: [],
        kwargs: [{ var: "kwarg1", type: "int", default: "1" }],
        decorators: [],
        exceptions: [{ type: "FileExistsError" }, { type: "KeyError" }],
        yields: { type: "[type]" },
        returns: { type: "[type]" },
    });
});

it("sphinx", () => {
    // const template = getTemplate("google");
    // parseDocstring(googleDocstring, template);

    // parseDocstring("world", "{{#place}}{{name}}{{/place}}");
    parseDocstring(fullSphinxDocstring, sphinxTemplate);
});

const googleTemplate = `
{{#parametersExist}}
Args:
{{#args}}
    {{var}} ({{typePlaceholder}}): {{descriptionPlaceholder}}
{{/args}}
{{#kwargs}}
    {{var}} ({{typePlaceholder}}, optional): {{descriptionPlaceholder}}. Defaults to {{&default}}.
{{/kwargs}}
{{/parametersExist}}

{{#exceptionsExist}}
Raises:
{{#exceptions}}
    {{type}}: {{descriptionPlaceholder}}
{{/exceptions}}
{{/exceptionsExist}}

{{#returnsExist}}
Returns:
{{#returns}}
    {{typePlaceholder}}: {{descriptionPlaceholder}}
{{/returns}}
{{/returnsExist}}

{{#yieldsExist}}
Yields:
{{#yields}}
    {{typePlaceholder}}: {{descriptionPlaceholder}}
{{/yields}}
{{/yieldsExist}}`;

const fullSphinxDocstring = `
:param arg1: [description]
:type arg1: [type]
:param arg2: [description]
:type arg2: [type]
:param kwarg1: [description], defaults to 1
:type kwarg1: int, optional
:raises FileExistsError: [description]
:return: [description]
:rtype: [type]
:yield: [description]
:rtype: [type]`;

const sphinxTemplate = `
{{#args}}
:param {{var}}: {{descriptionPlaceholder}}
:type {{var}}: {{typePlaceholder}}
{{/args}}
{{#kwargs}}
:param {{var}}: {{descriptionPlaceholder}}, defaults to {{&default}}
:type {{var}}: {{typePlaceholder}}, optional
{{/kwargs}}
{{#exceptions}}
:raises {{type}}: {{descriptionPlaceholder}}
{{/exceptions}}
{{#returns}}
:return: {{descriptionPlaceholder}}
:rtype: {{typePlaceholder}}
{{/returns}}
{{#yields}}
:yield: {{descriptionPlaceholder}}
:rtype: {{typePlaceholder}}
{{/yields}}`;
