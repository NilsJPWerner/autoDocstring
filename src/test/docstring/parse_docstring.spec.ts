import chai = require("chai");
import "mocha";

import { parseDocstring, getTemplate } from "../../docstring";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

it.only("should return the string containing the google mustache template", () => {
    const template = getTemplate("google");
    parseDocstring(googleDocstring, template);

    // parseDocstring("world", "{{#place}}{{name}}{{/place}}");
    parseDocstring(testString, testTemplate);
});

// describe("getTemplate()", () => {
//     context("when asked for google template", () => {
//         it("should return the string containing the google mustache template", () => {
//             const result = getTemplate("google");

//             expect(result).to.contain("Google Docstring Template");
//         });
//     });

//     context("when asked for sphinx template", () => {
//         it("should return the string containing the sphinx mustache template", () => {
//             const result = getTemplate("sphinx");

//             expect(result).to.contain("Sphinx Docstring Template");
//         });
//     });

//     context("when asked for sphinx template", () => {
//         it("should return the string containing the numpy mustache template", () => {
//             const result = getTemplate("numpy");

//             expect(result).to.contain("Numpy Docstring Template");
//         });
//     });

//     context("when asked for anything else", () => {
//         it("should return the string containing the default mustache template", () => {
//             const result = getTemplate("blah");
//             const result2 = getTemplate("default");

//             expect(result).to.contain("Default Docstring Template");
//             expect(result2).to.contain("Default Docstring Template");
//         });
//     });
// });

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
