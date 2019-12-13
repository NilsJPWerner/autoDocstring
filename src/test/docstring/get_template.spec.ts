import chai = require("chai");
import "mocha";

import { getTemplate } from "../../docstring/get_template";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getTemplate()", () => {
    context("when asked for google template", () => {
        it("should return the string containing the google mustache template", () => {
            const result = getTemplate("google");

            expect(result).to.contain("Google Docstring Template");
        });
    });

    context("when asked for sphinx template", () => {
        it("should return the string containing the sphinx mustache template", () => {
            const result = getTemplate("sphinx");

            expect(result).to.contain("Sphinx Docstring Template");
        });
    });

    context("when asked for numpy template", () => {
        it("should return the string containing the numpy mustache template", () => {
            const result = getTemplate("numpy");

            expect(result).to.contain("Numpy Docstring Template");
        });
    });

    context("when asked for epytext template", () => {
        it("should return the string containing the epytext mustache template", () => {
            const result = getTemplate("epytext");

            expect(result).to.contain("Epytext Docstring Template");
        });
    });

    context("when asked for anything else", () => {
        it("should return the string containing the default mustache template", () => {
            const result = getTemplate("blah");
            const result2 = getTemplate("default");

            expect(result).to.contain("Default Docstring Template");
            expect(result2).to.contain("Default Docstring Template");
        });
    });
});
