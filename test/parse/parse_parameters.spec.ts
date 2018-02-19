import chai = require('chai');
import 'mocha';

import { parseParameters } from '../../src/parse/parse_parameters';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('parseParameters()', () => {

    it("should parse an array of strings into a docstring struct", () => {
        var parameters = ["@decorator1", "@decorator2", "param1", "param2: int", "param3 = 1"];
        var result = parseParameters(parameters);

        expect(result.decorators).to.have.deep.members([
            { name: "decorator1" },
            { name: "decorator2" },
        ]);

        expect(result.args).to.have.deep.members([
            { var: "param1", type: "type" },
            { var: "param2", type: "int" },
        ]);

        expect(result.kwargs).to.have.deep.members([
            { var: "param3", default: "1", type: "int"},
        ])
    });

    it("should parse args with and without type hints", () => {
        var parameters = ["param1: List[string]", "param2"];
        var result = parseParameters(parameters);

        expect(result.args).to.have.deep.members([
            { var: "param1", type: "List[string]"},
            { var: "param2", type: "type"},
        ])
    });

    it("should parse args with strange spacing", () => {
        var parameters = [" param1 :    int ", "  param2 "];
        var result = parseParameters(parameters);

        expect(result.args).to.have.deep.members([
            { var: "param1", type: "int"},
            { var: "param2", type: "type"},
        ])
    });

    it("should parse kwargs with and without type hints", () => {
        var parameters = ["param1: List[int] = [1,2]", "param2 = 'abc'"];
        var result = parseParameters(parameters);

        expect(result.kwargs).to.have.deep.members([
            { var: "param1", default: "[1,2]", type: "List[int]"},
            { var: "param2", default: "'abc'", type: "str"},
        ])
    });

    it("should parse kwargs with strange spacing", () => {
        var parameters = [" param1 : str\t=\t'abc'", " param2    =  1"];
        var result = parseParameters(parameters);

        expect(result.kwargs).to.have.deep.members([
            { var: "param1", default: "'abc'", type: "str"},
            { var: "param2", default: "1", type: "int"},
        ])
    });

})
