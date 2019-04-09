import chai = require("chai");
import "mocha";

import { getBody, getDefinition } from "../../parse/get_lines";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getDefinition()", () => {
    context("when encountering a function", () => {
        it("should get a basic function definition", () => {
            const result = getDefinition(basicFunction, 4);

            expect(result).to.equal("def basic_function(param1, param2 = abc):");
        });

        it("should get an indented function definition", () => {
            const result = getDefinition(indentedFunction, 4);

            expect(result).to.equal("def indented_function(param1):");
        });

        it("should get a multiline function definition", () => {
            const result = getDefinition(multiLineFunction, 6);

            expect(result).to.equal("def multi_line_function(param1,param2 = 1):");
        });

        it("should return an empty string if there is a gap above position", () => {
            const result = getDefinition(gapFunction, 5);

            expect(result).to.equal("");
        });
    });

    context("when encountering a class", () => {
        it("should get the class definition", () => {
            const result = getDefinition(basicClass, 4);

            expect(result).to.equal("class BasicClass(object):");
        });
    });
});

describe("getBody()", () => {
    it("should return the body of a function", () => {
        const result = getBody(basicFunction, 4);

        expect(result).to.have.deep.members([
            "\"\"\"",
            "print(\"HELLO WORLD\")",
            "try:",
            "something()",
            "except Error:",
            "raise SomethingWentWrong",
            "return 3",
        ]);
    });

    it("should skip blank lines", () => {
        const result = getBody(gapFunction, 5);

        expect(result).to.have.deep.members([
            "\"\"\"",
            "print('HELLO WORLD')",
            "print('HELLO AGAIN')",
        ]);
    });
});

const basicFunction = `
    return 3

def basic_function(param1, param2 = abc):
    """
    print("HELLO WORLD")
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const indentedFunction = `
Something Else

    def indented_function(param1):

        print("HELLO WORLD")
`;

const multiLineFunction = `
Something Else

def multi_line_function(
        param1,
        param2 = 1):

    print("HELLO WORLD")
`;

const gapFunction = `
Something Else

def gap_function():

    """

    print('HELLO WORLD')

    print('HELLO AGAIN')

Something Else
`;

const basicClass = `
Something Else

class BasicClass(object):

    def __init__(self, param1):
        self.param1 = param1

    def hello(self):
        print("Hello world")
`;

// let
