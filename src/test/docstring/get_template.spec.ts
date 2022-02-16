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

    context("when asked for google-notypes template", () => {
        it("should return the string containing the google mustache template", () => {
            const result = getTemplate("google-notypes");

            expect(result).to.contain(
                "Google Docstring Template without Types for Args, Returns or Yields",
            );
        });
    });

    context("when asked for sphinx template", () => {
        it("should return the string containing the sphinx mustache template", () => {
            const result = getTemplate("sphinx");

            expect(result).to.contain("Sphinx Docstring Template");
        });
    });

    context("when asked for sphinx template", () => {
        it("should return the string containing the sphinx mustache template", () => {
            const result = getTemplate("sphinx-notypes");

            expect(result).to.contain("Sphinx Docstring Template without Types");
        });
    });

    context("when asked for numpy template", () => {
        it("should return the string containing the numpy-notypes mustache template", () => {
            const result = getTemplate("numpy");

            expect(result).to.contain("Numpy Docstring Template");
        });
    });

    context("when asked for numpy template", () => {
        it("should return the string containing the numpy-notypes mustache template", () => {
            const result = getTemplate("numpy-notypes");

            expect(result).to.contain("Numpy Docstring Template without Types");
        });
    });

    context("when asked for one-line-sphinx template", () => {
        it("should return the string containing the one-line-sphinx mustache template", () => {
            const result = getTemplate("one-line-sphinx");

            expect(result).to.contain("One-line RST Docstring Template");
        });
    });

    context("when asked for anything else", () => {
        it("should return the string containing the docblockr mustache template", () => {
            const result = getTemplate("blah");
            const result2 = getTemplate("default");

            expect(result).to.contain("DocBlockr Docstring Template");
            expect(result2).to.contain("DocBlockr Docstring Template");
        });
    });
});
