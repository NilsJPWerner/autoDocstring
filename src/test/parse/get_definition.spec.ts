import chai = require("chai");
import "mocha";

import { getDefinition } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getDefinition()", () => {
    context("when encountering a function", () => {
        it("should get a basic function definition", () => {
            const result = getDefinition(basicFunction, 5);

            expect(result).to.equal("def basic_function(param1, param2 = abc):");
        });

        it("should get an indented function definition", () => {
            const result = getDefinition(indentedFunction, 4);

            expect(result).to.equal("def indented_function(param1):");
        });

        it("should get a multiline function definition", () => {
            const result = getDefinition(multiLineFunction, 6);

            expect(result).to.equal("def multi_line_function( param1, param2 = 1):");
        });

        it("should ignore commented lines in a multiline function definition", () => {
            const result = getDefinition(multiLineCommentedLineFunction, 9);

            expect(result).to.equal(
                "def multi_line_function( param1: str, param2: List[int], param3: int ):",
            );
        });

        it("should get an async function definition", () => {
            const result = getDefinition(asyncFunction, 4);

            expect(result).to.equal("async def multi_line_function(param1,param2 = 1):");
        });

        it("should get a multiline function definition with a multiple indentation levels", () => {
            const result = getDefinition(multiLineMultiIndentationFunction, 7);

            expect(result).to.equal("def build( b: int, a: Tuple[int, dict]):");
        });

        it("should return an empty string if there is a gap above position", () => {
            const result = getDefinition(gapFunction, 5);

            expect(result).to.equal("");
        });

        it("should return an empty string if the position is at the top of the document", () => {
            const result = getDefinition('"""', 0);

            expect(result).to.equal("");
        });
    });

    context("when encountering a class", () => {
        it("should get the class definition from init", () => {
            const result = getDefinition(basicClass, 4);

            expect(result).to.equal("class BasicClass(self, param1):");
        });
        it("should get the class definition from multiline init", () => {
            const result = getDefinition(basicClass, 12);

            expect(result).to.equal("class AnotherBasicClass(self, param2):");
        });
    });
});

const basicFunction = `
def another_func():
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

const multiLineCommentedLineFunction = `
Something Else

def multi_line_function(
        param1: str,
        # a comment
        param2: List[int],
        param3: int
    ):

    print("HELLO WORLD")
`;

const asyncFunction = `
Something Else

async def multi_line_function(param1,param2 = 1):

    print("HELLO WORLD")
`;

const multiLineMultiIndentationFunction = `
Something Else

def build(
        b: int,
        a: Tuple[int,
                    dict]):

    pass
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

class AnotherBasicClass(object):

    def __init__(
            self, param2
        ):
        self.param2 = param2

    def hello(self):
        print("Goodbye world")
`;
