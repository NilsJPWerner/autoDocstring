import chai = require("chai");
import "mocha";

import { getDocstringIndentation } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getDocstringIndentation()", () => {
    it("should return 4 space indentation correctly", () => {
        const result = getDocstringIndentation(fourSpaceIndentation, 4, " ".repeat(4));

        expect(result).to.equal("    ");
    });

    it("should return 2 space indentation correctly", () => {
        const result = getDocstringIndentation(twoSpaceIndentation, 2, " ".repeat(2));

        expect(result).to.equal("  ");
    });

    it("should return 1 tab indentation correctly", () => {
        const result = getDocstringIndentation(oneTabIndentation, 4, "\t");

        expect(result).to.equal("\t");
    });

    it("should return nested indentation correctly", () => {
        const result = getDocstringIndentation(secondLayerIndentation, 2, " ".repeat(4));

        expect(result).to.equal(" ".repeat(8));
    });

    it("should return the correct indentation if there is no body", () => {
        const result = getDocstringIndentation(noBodyIndentation, 2, " ".repeat(4));

        expect(result).to.equal(" ".repeat(4));
    });

    it("should return the correct indentation if there is no body and the function is already indented", () => {
        const result = getDocstringIndentation(noBodyIndentedIndentation, 2, "\t");

        expect(result).to.equal("\t\t");
    });

    it("should default to default indentation if no indentation is found and line position is not 0", () => {
        const result = getDocstringIndentation(" \n \n", 1, " ".repeat(4));

        expect(result).to.equal(" ".repeat(4));
    });

    it("should default to no space if no indentation is found and line position is 0", () => {
        const result = getDocstringIndentation("", 0, " ".repeat(4));

        expect(result).to.equal("");
    });

});

const fourSpaceIndentation = `
    return 3

def basic_function(param1, param2 = abc):

    print("HELLO WORLD")

def something_else():
`;

const twoSpaceIndentation = `
def basic_function(param1, param2 = abc):

  print("HELLO WORLD")

def something_else():
`;

const oneTabIndentation = `
def basic_function(param1, param2 = abc):

\tprint("HELLO WORLD")
\ttry:
\t\tsomething()

def something_else():
`;

const secondLayerIndentation = `
    def basic_function(param1, param2 = abc):

        print("HELLO WORLD")
`;

const noBodyIndentation = `
def basic_function(param1, param2 = abc):

`;

const noBodyIndentedIndentation = `
\tdef basic_function(param1, param2 = abc):

`;
