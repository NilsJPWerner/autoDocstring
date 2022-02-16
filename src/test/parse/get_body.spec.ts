import chai = require("chai");
import "mocha";

import { getBody } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getBody()", () => {
    it("should return the body of a function", () => {
        const result = getBody(basicFunction, 4);

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
        const result = getBody(gapFunction, 5);

        expect(result).to.have.deep.members(["print('HELLO WORLD')", "print('HELLO AGAIN')"]);
    });

    it("should skip comment lines", () => {
        const result = getBody(commentFunction, 5);

        expect(result).to.have.deep.members(["print('HELLO AGAIN')"]);
    });

    it("should handle multi line definitions", () => {
        const result = getBody(multiLineDefFunction, 4);

        expect(result).to.have.deep.members(["pass"]);
    });

    it("should handle indented functions", () => {
        const result = getBody(indentedFunctions, 3);

        expect(result).to.have.deep.members(["return 2"]);

        const result2 = getBody(indentedFunctions, 6);

        expect(result2).to.have.deep.members(["pass"]);
    });

    it("should return an empty array if a function has no body", () => {
        const result = getBody(noBody, 2);

        expect(result).to.have.deep.members([]);

        const result2 = getBody(noBody, 4);

        expect(result2).to.have.deep.members([]);
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
