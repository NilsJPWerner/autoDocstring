import chai = require('chai');
import 'mocha';

import { tokenizeDefinition } from '../../src/parse/tokenize_definition';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('tokenizeDefinition()', () => {

    it("should tokenize a simple function definition string into its parameters", () => {
        var functionDefinition = 'def func(argument, kwarg="abc"):';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'argument',
            'kwarg=\"abc\"'
        ]);
    });

    it("should tokenize a multiline definition", () => {
        var functionDefinition = 'def func(arg1,\n arg2,\n arg3):';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'arg1',
            'arg2',
            'arg3',
        ]);
    });

    it("should tokenize parameters with tuples, lists and dicts", () => {
        var functionDefinition = 'def func(kwarg1=(1), kwarg2=["1", "2"], kwarg3={"key1": 1, "key2": 2}):';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg1=(1)',
            'kwarg2=["1", "2"]',
            'kwarg3={"key1": 1, "key2": 2}',
        ]);
    });

    it("should tokenize parantheses in quotes correctly", () => {
        var functionDefinition = 'def func(kwarg1="(abc):", kwarg2=\'[]]\', kwarg3="}}"):';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg1="(abc):"',
            'kwarg2=\'[]]\'',
            'kwarg3="}}"',
        ]);
    });

    it("should remove top level whitespace", () => {
        var functionDefinition = 'def func( kwarg1 = 1 , \narg, \targ2, kwarg2="\t\n "):';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg1=1',
            'arg',
            'arg2',
            'kwarg2="\t\n "',
        ]);
    });

    it("should handle weird but valid spacing", () => {
        var functionDefinition = 'def func   (    kwarg = 1) :';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg=1',
        ]);
    });

    it("should handle string literals", () => {
        var functionDefinition = 'def func(kwarg = """\nsomething\n""") :';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg="""\nsomething\n"""',
        ]);
    });

    it("should tokenize pep484 parameter and return types", () => {
        var functionDefinition = 'def func(arg: string, arg2: Callable[[], str]) -> str:';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'arg:string',
            'arg2:Callable[[], str]',
            '-> str',
        ]);
    });

    it("should tokenize pep484 return types", () => {
        var functionDefinition = 'def func() -> str:';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            '-> str',
        ]);
    });

    it("should split class definition arguments", () => {
        var functionDefinition = 'class abc_c(arg, arg_2):';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'arg',
            'arg_2',
        ]);
    });

    it("should return an empty array if no definition is found", () => {
        var functionDefinition = 'garbage';
        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.be.empty;
    });

});
