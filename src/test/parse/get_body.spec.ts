import chai = require("chai");
import "mocha";

import { getBody } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

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

const gapFunction = `
Something Else

def gap_function():

    """

    print('HELLO WORLD')

    print('HELLO AGAIN')

Something Else
`;
