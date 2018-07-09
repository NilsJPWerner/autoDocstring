import chai = require('chai');
import 'mocha';

import { isMultiLineString } from '../../src/parse/multi_line_string';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('isMultiLineString()', () => {
    it("should return true if there are non whitespace characters preceding the triple quotes", () => {
        let result = isMultiLineString(multilineString, 4, 10, '"""');

        expect(result).to.equal(true);
    })

    it("should return false if there are only white space characters preceding the triple quotes", () => {
        let result = isMultiLineString(notMultilineString, 4, 6, '"""');

        expect(result).to.equal(false);
    })
});


let multilineString = `
    return 3

def function(param1):
    i = """
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`

let notMultilineString = `
    return 3

def function(param1):
    """
    try:
        something()
    except Error:
        raise SomethingWentWrong
    return 3

def something_else():
`
