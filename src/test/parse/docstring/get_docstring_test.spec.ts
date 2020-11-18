import chai = require("chai");
import "mocha";

import { getDocstring } from "../../../parse/docstring/get_docstring";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe.only("getDocstring()", () => {
    it("should return the lines with the docstring the linePosition is focused on with quotes removed", () => {
        const result = getDocstring(oneLineDocstring, 4);

        expect(result).to.equal('    """A docstring"""');
    });

    it("should preserve the relative indentation", () => {
        const result = getDocstring(largeDocstring, 4);

        expect(result).to.equal(
            [
                '    """[summary]',
                "",
                "    Args:",
                "        a ([type]): [description]",
                "        b (int, optional): [description]. Defaults to 1.",
                "",
                "    Returns:",
                "        Tuple[int, d]: [description]",
                '    """',
            ].join("\n"),
        );
    });

    it("should work from linePosition at the beginning or end of the docstring", () => {
        for (const line of [4, 5, 6, 7, 8]) {
            const result = getDocstring(smallDocstring, line);

            expect(result).to.equal(
                [
                    '    """',
                    "    [summary]",
                    "",
                    "    [description]",
                    "    [more description]",
                    '    """',
                ].join("\n"),
                "Line: " + line,
            );
        }
    });

    it("should handle single quotes", () => {
        const result = getDocstring(singleQuoteDocstring, 4);

        expect(result).to.equal("    '''A docstring'''");
    });

    it("should return an empty string if a start and end could not be found", () => {
        const result = getDocstring(noDocstring, 4);

        expect(result).to.equal("");
    });
});

const oneLineDocstring = `
    return 3

def basic_function(param1, param2 = abc):
    """A docstring"""
    print("HELLO WORLD")
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const largeDocstring = `
Something Else

def gap_function():
    """[summary]

    Args:
        a ([type]): [description]
        b (int, optional): [description]. Defaults to 1.

    Returns:
        Tuple[int, d]: [description]
    """
    print('HELLO WORLD')

    print('HELLO AGAIN')

Something Else
`;
const smallDocstring = `
Something Else

def gap_function():
    """
    [summary]

    [description]
    [more description]
    """
    print('HELLO WORLD')

    print('HELLO AGAIN')

Something Else
`;

const indentedDocstring = `
Something Else

    def gap_function():
        """[summary]

        Args:
            a ([type]): [description]
            b (int, optional): [description]. Defaults to 1.

        Returns:
            Tuple[int, d]: [description]
        """
        print('HELLO WORLD')

        print('HELLO AGAIN')

Something Else
`;

const singleQuoteDocstring = `
    return 3

def basic_function(param1, param2 = abc):
    '''A docstring'''
    print("HELLO WORLD")
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`;

const noDocstring = `
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
