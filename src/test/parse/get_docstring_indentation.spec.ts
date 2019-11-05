import chai = require("chai");
import "mocha";

import { getDocstringIndentation } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getDocstringIndentation()", () => {
    it("should return 4 space indentation correctly", () => {
        const result = getDocstringIndentation(fourSpaceIndentation, 4);

        expect(result).to.equal("    ");
    });

    it("should return 2 space indentation correctly", () => {
        const result = getDocstringIndentation(twoSpaceIndentation, 2);

        expect(result).to.equal("  ");
    });

    it("should return 1 tab indentation correctly", () => {
        const result = getDocstringIndentation(oneTabIndentation, 4);

        expect(result).to.equal("\t");
    });

    it("should return nested indentation correctly", () => {
        const result = getDocstringIndentation(secondLayerIndentation, 2);

        expect(result).to.equal("        ");
    });

    it("should default to blank string if no indentation is found", () => {
        const result = getDocstringIndentation("", 0);

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
