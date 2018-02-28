import chai = require('chai');
import 'mocha';

import { docstringIsClosed } from '../../src/parse/closed_docstring';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('docstringIsClosed()', () => {
    it("should return true if the preceding quotes close an existing docstring", () => {
        let result = docstringIsClosed(closedDocstring, 6, 7);

        expect(result).to.equal(true);
    })

    it("should return true if the preceding quotes open an existing docstring", () => {
        let result = docstringIsClosed(closedDocstring, 4, 7);

        expect(result).to.equal(true);
    })

    it("should return true if the preceding quotes closes a one line docstring", () => {
        let result = docstringIsClosed(closedOneLineDocstring, 4, 17);

        expect(result).to.equal(true);
    })

    it("should return true if the preceding quotes opens a one line docstring", () => {
        let result = docstringIsClosed(closedOneLineDocstring, 4, 7);

        expect(result).to.equal(true);
    })

    it("should return true if the preceding quotes closes a multiline docstring", () => {
        let result = docstringIsClosed(closedMultilineDocstring, 7, 7);

        expect(result).to.equal(true);
    })

    it("should return true if the preceding quotes open a multiline docstring", () => {
        let result = docstringIsClosed(closedMultilineDocstring, 2, 7);

        expect(result).to.equal(true);
    })

    it("should return false if the preceding quotes open a non closed docstring", () => {
        let result = docstringIsClosed(openDocstring, 2, 7);

        expect(result).to.equal(false);
    })

    it.only("should return false if the preceding quotes open a non closed docstring for a second function", () => {
        let result = docstringIsClosed(openDocstringSecondFunction, 7, 7);

        expect(result).to.equal(false);
    })
});


let closedDocstring = `
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
`

let closedOneLineDocstring = `
    return 3

def function(param1):
    """summary"""
    print("HELLO WORLD")
    try:
        something()
`

let closedMultilineDocstring = `
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
`

let openDocstring = `
def function(param1):
    """
    print("HELLO WORLD")
    try:
        something()
`

let openDocstringSecondFunction = `
def function(param1):
    print("HELLO WORLD")
    try:
        something()

def function2(param1):
    """
    print("HELLO WORLD")

def function3(param1):
    print("HELLO WORLD")
`
