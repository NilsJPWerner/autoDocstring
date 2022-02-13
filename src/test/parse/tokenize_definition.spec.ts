import chai = require("chai");
import "mocha";
import { tokenizeDefinition } from "../../parse/tokenize_definition";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("tokenizeDefinition()", () => {
    it("should tokenize a simple function definition string into its parameters", () => {
        const functionDefinition = 'def func(argument, kwarg="abc"):';
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["argument", 'kwarg="abc"']);
    });

    it("should tokenize a multiline definition", () => {
        const functionDefinition = "def func(arg1,\n arg2,\n arg3):";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["arg1", "arg2", "arg3"]);
    });

    it("should tokenize parameters with tuples, lists and dicts", () => {
        const functionDefinition =
            'def func(kwarg1=(1), kwarg2=["1", "2"], kwarg3={"key1": 1, "key2": 2}):';
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            "kwarg1=(1)",
            'kwarg2=["1", "2"]',
            'kwarg3={"key1": 1, "key2": 2}',
        ]);
    });

    it("should tokenize parentheses in quotes correctly", () => {
        const functionDefinition = 'def func(kwarg1="(abc):", kwarg2=\'[]]\', kwarg3="}}"):';
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(['kwarg1="(abc):"', "kwarg2='[]]'", 'kwarg3="}}"']);
    });

    it("should remove top level whitespace", () => {
        const functionDefinition = 'def func( kwarg1 = 1 , \narg, \targ2, kwarg2="\t\n "):';
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["kwarg1=1", "arg", "arg2", 'kwarg2="\t\n "']);
    });

    it("should handle weird but valid spacing", () => {
        const functionDefinition = "def func   (    kwarg = 1) :";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["kwarg=1"]);
    });

    it("should handle string literals", () => {
        const functionDefinition = 'def func(kwarg = """\nsomething\n""") :';
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(['kwarg="""\nsomething\n"""']);
    });

    it("should tokenize pep484 parameter and return types", () => {
        const functionDefinition = "def func(arg: string, arg2: Callable[[], str]) -> str:";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["arg:string", "arg2:Callable[[], str]", "-> str"]);
    });

    it("should tokenize pep604 parameter and return types", () => {
        const functionDefinition =
            "def func(arg: int | float | str, arg2: dict[str, str] | list[str]) -> int | float | str:";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            "arg:int | float | str",
            "arg2:dict[str, str] | list[str]",
            "-> int | float | str",
        ]);
    });

    it("should tokenize pep484 return types", () => {
        const functionDefinition = "def func() -> str:";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["-> str"]);
    });

    it("should tokenize Literal types", () => {
        const functionDefinition = `def func(x: Literal["r", "w", "a"]) -> Literal[1, 2, 3]:`;
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([`x:Literal["r", "w", "a"]`, `-> Literal[1, 2, 3]`]);
    });

    it("should split class definition arguments", () => {
        const functionDefinition = "class abc_c(arg, arg_2):";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["arg", "arg_2"]);
    });

    it("should return an empty array if no definition is found", () => {
        const functionDefinition = "garbage";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.be.empty;
    });

    it("should ignore comments at the end of the definition", () => {
        const functionDefinition = "def abc_c(arg, arg_2): # Something";
        const result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members(["arg", "arg_2"]);
    });
});
