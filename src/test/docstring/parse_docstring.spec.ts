import chai = require("chai");
import "mocha";

import { parseDocstring, getTemplate } from "../../docstring";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

it.only("should return the string containing the google mustache template", () => {
    // const template = getTemplate("google");
    // parseDocstring(googleDocstring, template);

    // parseDocstring("world", "{{#place}}{{name}}{{/place}}");
    parseDocstring(oldDocstring, newDocstring);
});

const oldDocstring = `
[summary]

Args:
    a (int): [description]
    b (str): abcdefg hijk
`;

const newDocstring = `
[summary]

Args:
    a (int): [description]
    c (list, optional): [description]. Defaults to [1,2].
    d (str): abcdefg hijk
`;

const googleDocstring = `
[summary]

Args:
    a (int): [description]
    b (str): [description]
    c (list, optional): [description]. Defaults to [1,2].

Raises:
    EnvironmentError: [description]
    ArithmeticError: [description]

Returns:
    [type]: [description]
`;

const testTemplate = `{{#args}}{{var}}
{{/args}}`;

const testString = `a a`;
