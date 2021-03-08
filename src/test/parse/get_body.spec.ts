import chai = require("chai");
import "mocha";

import { getBody } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getBody()", () => {
    context("when encoutering a function", () => {
        it("should return the body of a function", () => {
            const result = getBody("method", basicFunction, 4);

            expect(result).to.have.deep.members([
                'print("HELLO WORLD")',
                "try:",
                "something()",
                "except Error:",
                "raise SomethingWentWrong",
                "return 3",
            ]);
        });

        it("should skip blank lines", () => {
            const result = getBody("method", gapFunction, 5);

            expect(result).to.have.deep.members(["print('HELLO WORLD')", "print('HELLO AGAIN')"]);
        });

        it("should skip comment lines", () => {
            const result = getBody("method", commentFunction, 5);

            expect(result).to.have.deep.members(["print('HELLO AGAIN')"]);
        });

        it("should handle multi line definitions", () => {
            const result = getBody("method", multiLineDefFunction, 4);

            expect(result).to.have.deep.members(["pass"]);
        });

        it("should handle indented functions", () => {
            const result = getBody("method", indentedFunctions, 3);

            expect(result).to.have.deep.members(["return 2"]);

            const result2 = getBody("method", indentedFunctions, 6);

            expect(result2).to.have.deep.members(["pass"]);
        });

        it("should return an empty array if a function has no body", () => {
            const result = getBody("method", noBody, 2);

            expect(result).to.have.deep.members([]);

            const result2 = getBody("method", noBody, 4);

            expect(result2).to.have.deep.members([]);
        });
    });
    context("when encoutering a class", () => {
        it("should return the body of a function", () => {
            const result = getBody("method", basicFunction, 4);

            expect(result).to.have.deep.members([
                'print("HELLO WORLD")',
                "try:",
                "something()",
                "except Error:",
                "raise SomethingWentWrong",
                "return 3",
            ]);
        });

        it("should skip blank lines", () => {
            const result = getBody("method", gapFunction, 5);

            expect(result).to.have.deep.members(["print('HELLO WORLD')", "print('HELLO AGAIN')"]);
        });

        it("should skip comment lines", () => {
            const result = getBody("method", commentFunction, 5);

            expect(result).to.have.deep.members(["print('HELLO AGAIN')"]);
        });

        it("should handle multi line definitions", () => {
            const result = getBody("method", multiLineDefFunction, 4);

            expect(result).to.have.deep.members(["pass"]);
        });

        it("should handle indented functions", () => {
            const result = getBody("method", indentedFunctions, 3);

            expect(result).to.have.deep.members(["return 2"]);

            const result2 = getBody("method", indentedFunctions, 6);

            expect(result2).to.have.deep.members(["pass"]);
        });

        it("should return an empty array if a function has no body", () => {
            const result = getBody("method", noBody, 2);

            expect(result).to.have.deep.members([]);

            const result2 = getBody("method", noBody, 4);

            expect(result2).to.have.deep.members([]);
        });
    });
});

const basicFunction = `
    return 3

def basic_function(param1, param2 = abc):

    print("HELLO WORLD")
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const gapFunction = `
Something Else

def gap_function():


    print('HELLO WORLD')

    print('HELLO AGAIN')

Something Else
`;

const commentFunction = `
Something Else

def gap_function():
    # print('HELLO WORLD')
    print('HELLO AGAIN')

Something Else
`;

const multiLineDefFunction = `
def multi_line_func(arg,
                arg2,
                kwarg=""):

    pass

def next_func():
    pass
`;

const indentedFunctions = `
    def indented_func():

        return 2

    def indented_func2():

        pass

def next_func():
    pass
`;

const noBody = `
def no_body():
    
def next_no_body():

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

const docstringType = 'method';
