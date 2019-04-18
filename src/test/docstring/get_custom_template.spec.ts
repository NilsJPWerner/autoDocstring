import chai = require("chai");
import "mocha";

import { getCustomTemplate } from "../../docstring/get_template";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getCustomTemplate()", () => {
    context("when given a path for a template file", () => {
        it("should return the string in the file", () => {
            const result = getCustomTemplate(__dirname + "/custom_template_test.mustache");

            expect(result).to.contain("Custom Docstring Template");
        });
    });
});
