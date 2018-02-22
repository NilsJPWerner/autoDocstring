import chai = require('chai');
import 'mocha';

import { parseParameters } from '../../src/parse/parse_function';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('parseParameters()', () => {

    it("should parse an array of strings into a docstring struct", () => {
        var parameterTokens = ["@decorator1", "@decorator2", "param1", "param2: int", "param3 = 1"];
        var result = parseParameters(parameterTokens, "");

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
        var parameterTokens = ["param1: List[string]", "param2"];
        var result = parseParameters(parameterTokens, "");

        expect(result.args).to.have.deep.members([
            { var: "param1", type: "List[string]"},
            { var: "param2", type: "type"},
        ])
    });

    it("should parse args with strange spacing", () => {
        var parameterTokens = [" param1 :    int ", "  param2 ", "param3:List[int]"];
        var result = parseParameters(parameterTokens, "");

        expect(result.args).to.have.deep.members([
            { var: "param1", type: "int"},
            { var: "param2", type: "type"},
            { var: "param3", type: "List[int]"},
        ])
    });

    it("should parse kwargs with and without type hints", () => {
        var parameterTokens = ["param1: List[int] = [1,2]", "param2 = 'abc'"];
        var result = parseParameters(parameterTokens, "");

        expect(result.kwargs).to.have.deep.members([
            { var: "param1", default: "[1,2]", type: "List[int]"},
            { var: "param2", default: "'abc'", type: "str"},
        ])
    });

    it("should parse kwargs with strange spacing", () => {
        var parameterTokens = [" param1 : str\t=\t'abc'", " param2    =  1", "param3:int=2"];
        var result = parseParameters(parameterTokens, "");

        expect(result.kwargs).to.have.deep.members([
            { var: "param1", default: "'abc'", type: "str"},
            { var: "param2", default: "1", type: "int"},
            { var: "param3", default: "2", type: "int"},
        ])
    });

    it("should parse return types", () => {
        var parameterTokens = ["-> List[int]"];
        var result = parseParameters(parameterTokens, "");

        expect(result.returns).to.deep.equal({
            type: "List[int]",
        })
    });

    it("should parse return types with strange spacing", () => {
        var parameterTokens = ["\t -> \tint  \t"];
        var result = parseParameters(parameterTokens, "");

        expect(result.returns).to.deep.equal({
            type: "int",
        })
    });

    it("should parse simple exception", () => {
        var functionContent = "raise Exception";
        var result = parseParameters([], functionContent);

        expect(result.raises).to.have.deep.members([
            { exception: "Exception" }
        ])
    });

    it("should find all exceptions in a function body", () => {
        var functionContent = `
            var = func()
            if var == 'bad':
                raise BadVar
            try:
                somethingRisky()
            catch Error:
                raise RiskyException
            raise AlwaysCrapsOut
        `;
        var result = parseParameters([], functionContent);

        expect(result.raises).to.have.deep.members([
            { exception: "BadVar" },
            { exception: "RiskyException" },
            { exception: "AlwaysCrapsOut" },
        ])
    });
})
