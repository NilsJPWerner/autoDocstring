import chai = require("chai");
import "mocha";

import { isMultiLineString } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("isMultiLineString()", () => {
    it("should return true if there are non whitespace characters preceding the triple quotes", () => {
        const result = isMultiLineString(multilineString, 4, 10, '"""');

        expect(result).to.equal(true);
    });

    it("should return false if there are only white space characters preceding the triple quotes", () => {
        const result = isMultiLineString(notMultilineString, 4, 6, '"""');

        expect(result).to.equal(false);
    });
});

const multilineString = `
    return 3

def function(param1):
    i = """
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const notMultilineString = `
    return 3

def function(param1):
    """
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;
