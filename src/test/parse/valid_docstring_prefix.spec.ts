import chai = require("chai");
import "mocha";

import { validDocstringPrefix } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("validDocstringPrefix()", () => {
    it("should return false if there are non whitespace characters preceding the triple quotes", () => {
        const result = validDocstringPrefix(charsBeforeQuotes, 4, 10, '"""');

        expect(result).to.equal(false);
    });

    it("should return false if there are characters after the triple quotes", () => {
        const result = validDocstringPrefix(charsAfterQuotes, 4, 6, '"""');

        expect(result).to.equal(false);
    });

    it("should return true if there are only white space characters preceding the triple quotes", () => {
        const result = validDocstringPrefix(validDocstringStart, 4, 6, '"""');

        expect(result).to.equal(true);
    });

    it("should use quote style to build matcher", () => {
        const result = validDocstringPrefix(validSingleQuoteDocstringStart, 4, 6, "'''");

        expect(result).to.equal(true);
    });

    it("should work with carriage returns", () => {
        const result = validDocstringPrefix(validDocstringCarriageReturnStart, 4, 6, '"""');

        expect(result).to.equal(true);
    });
});

const charsBeforeQuotes = `
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

const charsAfterQuotes = `
    return 3

def function(param1):
    """ abc
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const validDocstringStart = `
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

const validDocstringCarriageReturnStart = `
    return 3

def function(param1):
    """
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`.replace("\n", "\r\n");

const validSingleQuoteDocstringStart = `
    return 3

def function(param1):
    '''
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;
