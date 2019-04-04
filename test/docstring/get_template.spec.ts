import chai = require('chai');
import 'mocha';

import { getTemplate } from "../../src/docstring/get_template"

chai.config.truncateThreshold = 0;
let expect = chai.expect;


describe('getTemplate()', () => {
    context("when asked for google template", () => {
        it("should return the string containing the google mustache template", () => {
            var result = getTemplate("google");

            expect(result).to.contain("Google Docstring Template");
        });
    });

    context("when asked for sphinx template", () => {
        it("should return the string containing the sphinx mustache template", () => {
            var result = getTemplate("sphinx");

            expect(result).to.contain("Sphinx Docstring Template");
        });
    });

    context("when asked for sphinx template", () => {
        it("should return the string containing the numpy mustache template", () => {
            var result = getTemplate("numpy");

            expect(result).to.contain("Numpy Docstring Template");
        });
    });

    context("when asked for anything else", () => {
        it("should return the string containing the default mustache template", () => {
            var result = getTemplate("blah");
            var result2 = getTemplate("default");

            expect(result).to.contain("Default Docstring Template");
            expect(result2).to.contain("Default Docstring Template");
        });
    });
});
