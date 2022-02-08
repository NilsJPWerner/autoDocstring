import chai = require("chai");
import "mocha";

import { parseParameters } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("parseParameters()", () => {
    context("when encoutering a method", () => {
        it("should parse an array of strings into a docstring struct", () => {
            const parameterTokens = [
                "@decorator1",
                "@decorator2",
                "param1",
                "param2: int",
                "param3 = 1",
                "param4: str = 'abc'",
                "-> int",
            ];

            const body = ["   raise Exception", "raise Exception2"];

            const functionName = "function";
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, body, functionName);

            expect(result).to.eql({
                name: "function",
                decorators: [{ name: "decorator1" }, { name: "decorator2" }],
                args: [
                    { var: "param1", type: undefined },
                    { var: "param2", type: "int" },
                ],
                kwargs: [
                    { var: "param3", default: "1", type: "int" },
                    { var: "param4", default: "'abc'", type: "str" },
                ],
                returns: { type: "int" },
                yields: undefined,
                exceptions: [{ type: "Exception" }, { type: "Exception2" }],
                classes: [],
                methods: [],
                attributes: [],
            });
        });

        it("should parse args with and without type hints", () => {
            const parameterTokens = ["param1: List[string]", "param2"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.args).to.have.deep.members([
                { var: "param1", type: "List[string]" },
                { var: "param2", type: undefined },
            ]);
        });

        it("should parse kwargs with and without type hints", () => {
            const parameterTokens = ["param1: List[int] = [1,2]", "param2 = 'abc'"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.kwargs).to.have.deep.members([
                { var: "param1", default: "[1,2]", type: "List[int]" },
                { var: "param2", default: "'abc'", type: "str" },
            ]);
        });
    });

    context("when encoutering a class", () => {
        it("should return only parameters when no attributes are defined in body", () => {
            const parameterTokens = [
                "@decorator1",
                "@decorator2",
                "param1",
                "param2: int",
                "param3 = 1",
                "param4: str = 'abc'",
                "-> int",
            ];

            const body = ["   raise Exception", "raise Exception2"];

            const functionName = "testClass";
            const docstringType = "class";
            const result = parseParameters(docstringType, parameterTokens, body, functionName);

            expect(result).to.eql({
                name: "testClass",
                decorators: [{ name: "decorator1" }, { name: "decorator2" }],
                args: [
                    { var: "param1", type: undefined },
                    { var: "param2", type: "int" },
                ],
                kwargs: [
                    { var: "param3", default: "1", type: "int" },
                    { var: "param4", default: "'abc'", type: "str" },
                ],
                returns: undefined,
                yields: undefined,
                exceptions: [],
                classes: [],
                methods: [],
                attributes: [],
            });
        });

        it("should return only parameters when no attributes are defined in body", () => {
            const parameterTokens = [
                "@decorator1",
                "@decorator2",
                "param1",
                "param2: int",
                "param3 = 1",
                "param4: str = 'abc'",
                "-> int",
            ];

            const body = ["",
                          "    def __init__(self, param1, param2: int, param3 = 1, param4: str = 'abc'):",
                          "        self.param1 = param1",
                          "        self.param2 = param2",
                          "        self.param3 = param3",
                          "        self.param4 = param4",
                          "        self.param5 = 7"];

            const functionName = "testClass";
            const docstringType = "class";
            const result = parseParameters(docstringType, parameterTokens, body, functionName);

            expect(result).to.eql({
                name: "testClass",
                decorators: [{ name: "decorator1" }, { name: "decorator2" }],
                args: [
                    { var: "param1", type: undefined },
                    { var: "param2", type: "int" },
                ],
                kwargs: [
                    { var: "param3", default: "1", type: "int" },
                    { var: "param4", default: "'abc'", type: "str" },
                ],
                returns: undefined,
                yields: undefined,
                exceptions: [],
                classes: [],
                methods: [],
                attributes: [
                    { var: "param5", type: undefined}
                ],
            });
        });

    });

    describe("parseReturns", () => {
        it("should parse return types", () => {
            const parameterTokens = ["-> List[int]"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.returns).to.deep.equal({
                type: "List[int]",
            });
        });

        it("should parse return types wrapped in single quotes", () => {
            expect(
                parseParameters(["-> 'List[Type]'"], [], "name").returns
            ).to.deep.equal({
                type: "List[Type]"
            });
        });

        it("should parse return types wrapped in double quotes", () => {
            expect(
                parseParameters(['-> "List[Type]"'], [], "name").returns
            ).to.deep.equal({
                type: "List[Type]"
            });
        });

        it("should not parse '-> None' return types", () => {
            const parameterTokens = ["-> None"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.returns).to.deep.equal(undefined);
        });

        it("should not parse '-> Generator' return types", () => {
            const parameterTokens = ["-> Generator[int]"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.returns).to.deep.equal(undefined);
        });

        it("should not parse '-> Iterator' return types", () => {
            const parameterTokens = ["-> Iterator[int]"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.returns).to.deep.equal(undefined);
        });
    });

    describe("parseYields", () => {
        it("should use the signature return type if it is an Iterator", () => {
            const parameterTokens = ["-> Iterator[int]"];
            const body = [];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, body, "name");

            expect(result.yields).to.deep.equal({
                type: "Iterator[int]",
            });
        });

        it("should use the signature return type if it is an Generator", () => {
            const parameterTokens = ["-> Generator[int]"];
            const body = [];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, body, "name");

            expect(result.yields).to.deep.equal({
                type: "Generator[int]",
            });
        });

        it("Should use the return type as the yield type if a yield exists in the body", () => {
            const parameterTokens = ["-> int"];
            const body = ["yield 4"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, body, "name");

            expect(result.yields).to.eql({
                type: "Iterator[int]",
            });
        });

        it("Should return a yield without type if a yield exists in the body but there is no return signature", () => {
            const parameterTokens = [""];
            const body = ["yield 4"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, body, "name");

            expect(result.yields).to.eql({
                type: undefined,
            });
        });

        it("Should return undefined if no yield exists in the signature or body", () => {
            const parameterTokens = ["-> List[int]"];
            const body = [];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, body, "name");

            expect(result.yields).to.eql(undefined);
        });
    });

    it("should result in no yield if there is no yield type or yield in body", () => {
        const docstringType = "method";
        const result = parseParameters(docstringType, [], [], "name");

        expect(result.returns).to.eql(undefined);
    });

    it("should parse the return from the body if there is no return type in the definition", () => {
        const parameterTokens = ["param1"];
        const body = ["return 3"];
        const docstringType = "method";
        const result = parseParameters(docstringType, parameterTokens, body, "");

        expect(result.returns).to.eql({
            type: undefined,
        });
    });

    it("should result in no return if there is no return type or return in body", () => {
        const docstringType = "method";
        const result = parseParameters(docstringType, [], [], "name");

        expect(result.returns).to.eql(undefined);
    });

    it("should parse simple exception", () => {
        const docstringType = "method";
        const functionContent = ["raise Exception"];
        const result = parseParameters(docstringType, [], functionContent, "");

        expect(result.exceptions).to.have.deep.members([{ type: "Exception" }]);
    });

    it("should find all exceptions in a function body", () => {
        const functionContent = [
            "let = func()",
            "if let == 'bad':",
            "    raise BadVar",
            "try:",
            "    somethingRisky()",
            "catch Error:",
            "    raise RiskyException",
            "raise AlwaysCrapsOut",
        ];
        const docstringType = "method";
        const result = parseParameters(docstringType, [], functionContent, "");

        expect(result.exceptions).to.have.deep.members([
            { type: "BadVar" },
            { type: "RiskyException" },
            { type: "AlwaysCrapsOut" },
        ]);
    });

    it("should not parse exception after inline comment", () => {
        const functionContent = ["arg1 + arg2 # todo: raise an error"];
        const result = parseParameters("method", [], functionContent, "");

        expect(result.exceptions).to.eql([]);
    });

    context("when the parameters have strange spacing", () => {
        it("should parse args with strange spacing", () => {
            const docstringType = "method";
            const parameterTokens = [" param1 :    int ", "  param2 ", "param3:List[int]"];
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.args).to.have.deep.members([
                { var: "param1", type: "int" },
                { var: "param2", type: undefined },
                { var: "param3", type: "List[int]" },
            ]);
        });

        it("should parse kwargs with strange spacing", () => {
            const parameterTokens = [" param1 : str\t=\t'abc'", " param2    =  1", "param3:int=2"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.kwargs).to.have.deep.members([
                { var: "param1", default: "'abc'", type: "str" },
                { var: "param2", default: "1", type: "int" },
                { var: "param3", default: "2", type: "int" },
            ]);
        });

        it("should parse return types with strange spacing", () => {
            const parameterTokens = ["\t -> \tint  \t"];
            const docstringType = "method";
            const result = parseParameters(docstringType, parameterTokens, [], "name");

            expect(result.returns).to.deep.equal({
                type: "int",
            });
        });
    });
});
