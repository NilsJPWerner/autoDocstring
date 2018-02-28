import chai = require('chai');
import 'mocha';

import { parseParameters } from '../../src/parse/parse_parameters';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('parseParameters()', () => {

    it("should parse an array of strings into a docstring struct", () => {
        let parameterTokens = [
            "@decorator1",
            "@decorator2",
            "param1",
            "param2: int",
            "param3 = 1",
            "param4: str = 'abc'",
            "-> int"
        ];
        let body = [
            "   raise Exception",
            "raise Exception2"
        ]

        let result = parseParameters(parameterTokens, body);

        expect(result).to.eql({
            decorators: [
                { name: "decorator1" },
                { name: "decorator2" },
            ],
            args: [
                { var: "param1", type: undefined },
                { var: "param2", type: "int" },
            ],
            kwargs: [
                { var: "param3", default: "1", type: "int"},
                { var: "param4", default: "'abc'", type: "str"},
            ],
            returns: { type: "int" },
            raises: [
                { exception: "Exception" },
                { exception: "Exception2" },
            ],
        });
    });

    it("should parse args with and without type hints", () => {
        let parameterTokens = ["param1: List[string]", "param2"];
        let result = parseParameters(parameterTokens, []);

        expect(result.args).to.have.deep.members([
            { var: "param1", type: "List[string]" },
            { var: "param2", type: undefined },
        ])
    });

    it("should parse kwargs with and without type hints", () => {
        let parameterTokens = ["param1: List[int] = [1,2]", "param2 = 'abc'"];
        let result = parseParameters(parameterTokens, []);

        expect(result.kwargs).to.have.deep.members([
            { var: "param1", default: "[1,2]", type: "List[int]" },
            { var: "param2", default: "'abc'", type: "str" },
        ])
    });

    it("should parse return types", () => {
        let parameterTokens = ["-> List[int]"];
        let result = parseParameters(parameterTokens, []);

        expect(result.returns).to.deep.equal({
            type: "List[int]",
        })
    });

    it("should parse the return from the body if there is no return type in the definition", () => {
        let parameterTokens = ["param1"];
        let body = ["return 3"]
        let result = parseParameters(parameterTokens, body);

        expect(result.returns).to.eql({
            type: undefined,
        })
    })

    it("should result in no return if there is no return type or return in body", () => {
        let result = parseParameters([], []);

        expect(result.returns).to.eql(undefined);
    })

    it("should parse simple exception", () => {
        let functionContent = ["raise Exception"];
        let result = parseParameters([], functionContent);

        expect(result.raises).to.have.deep.members([
            { exception: "Exception" }
        ])
    });

    it("should find all exceptions in a function body", () => {
        let functionContent = [
            "let = func()",
            "if let == 'bad':",
            "    raise BadVar",
            "try:",
            "    somethingRisky()",
            "catch Error:",
            "    raise RiskyException",
            "raise AlwaysCrapsOut",

        ];
        let result = parseParameters([], functionContent);

        expect(result.raises).to.have.deep.members([
            { exception: "BadVar" },
            { exception: "RiskyException" },
            { exception: "AlwaysCrapsOut" },
        ])
    });

    context("when the parameters have strange spacing", () => {
        it("should parse args with strange spacing", () => {
            let parameterTokens = [" param1 :    int ", "  param2 ", "param3:List[int]"];
            let result = parseParameters(parameterTokens, []);

            expect(result.args).to.have.deep.members([
                { var: "param1", type: "int"},
                { var: "param2", type: undefined},
                { var: "param3", type: "List[int]"},
            ])
        });

        it("should parse kwargs with strange spacing", () => {
            let parameterTokens = [" param1 : str\t=\t'abc'", " param2    =  1", "param3:int=2"];
            let result = parseParameters(parameterTokens, []);

            expect(result.kwargs).to.have.deep.members([
                { var: "param1", default: "'abc'", type: "str"},
                { var: "param2", default: "1", type: "int"},
                { var: "param3", default: "2", type: "int"},
            ])
        });

        it("should parse return types with strange spacing", () => {
            let parameterTokens = ["\t -> \tint  \t"];
            let result = parseParameters(parameterTokens, []);

            expect(result.returns).to.deep.equal({
                type: "int",
            })
        });
    });
})
