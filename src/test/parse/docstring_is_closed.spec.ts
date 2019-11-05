import chai = require("chai");
import "mocha";

import { docstringIsClosed } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("docstringIsClosed()", () => {
    it("should return true if the preceding quotes close an existing docstring", () => {
        const result = docstringIsClosed(closedDocstring, 6, 7, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes open an existing docstring", () => {
        const result = docstringIsClosed(closedDocstring, 4, 7, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes closes a one line docstring", () => {
        const result = docstringIsClosed(closedOneLineDocstring, 4, 17, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes opens a one line docstring", () => {
        const result = docstringIsClosed(closedOneLineDocstring, 4, 7, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes closes a multiline docstring", () => {
        const result = docstringIsClosed(closedMultilineDocstring, 7, 7, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes open a multiline docstring", () => {
        const result = docstringIsClosed(closedMultilineDocstring, 2, 7, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes open a multiline string", () => {
        const result = docstringIsClosed(closedMultilineString, 2, 16, '"""');

        expect(result).to.equal(true);
    });

    it("should return true if the preceding quotes close a multiline string", () => {
        const result = docstringIsClosed(closedMultilineString, 6, 7, '"""');

        expect(result).to.equal(true);
    });

    it("should return false if the preceding quotes open a non closed docstring", () => {
        const result = docstringIsClosed(openDocstring, 2, 7, '"""');

        expect(result).to.equal(false);
    });

    it("should return false if the preceding quotes open a non closed docstring for a second function", () => {
        const result = docstringIsClosed(openDocstringSecondFunction, 7, 7, '"""');

        expect(result).to.equal(false);
    });
});

const closedDocstring = `
    return 3

def function(param1):
    """ summary
    description
    """
    print("HELLO WORLD")
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const closedOneLineDocstring = `
    return 3

def function(param1):
    """summary"""
    print("HELLO WORLD")
    try:
        something()
`;

const closedMultilineDocstring = `
def function(param1):
    """ summary
    Some Explanation
        Some more stuff here
            And even more
    Back at this level
    """
    print("HELLO WORLD")
    try:
        something()
`;

const openDocstring = `
def function(param1):
    """
    print("HELLO WORLD")
    try:
        something()
`;

const openDocstringSecondFunction = `
def function(param1):
    print("HELLO WORLD")
    try:
        something()

def function2(param1):
    """
    print("HELLO WORLD")

def function3(param1):
    print("HELLO WORLD")
`;

const closedMultilineString = `
def function(param1):
    string = """
    This is a string
    Not a docstring
        Should still work
    """
    print("HELLO WORLD")
    try:
        something()
`;
