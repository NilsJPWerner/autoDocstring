import * as vscode from 'vscode';
import { expect } from 'chai';
import 'mocha';

import { tokenizeDefinition } from '../../src/parse/tokenize_definition';

describe('tokenizeDefinition', () => {

    it("Should tokenize a simple function definition string into its parameters", () => {
        var functionDefinition = 'def func(argument, kwarg="abc"):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'argument',
            'kwarg=\"abc\"'
        ]);
    });

    it("Should tokenize a multiline definition", () => {
        var functionDefinition = 'def func(arg1,\n arg2,\n arg3):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'arg1',
            'arg2',
            'arg3',
        ]);
    });

    it("Should tokenize parameters with tuples, lists and dicts", () => {
        var functionDefinition = 'def func(kwarg1=(1), kwarg2=["1", "2"], kwarg3={"key1": 1, "key2": 2}):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg1=(1)',
            'kwarg2=["1", "2"]',
            'kwarg3={"key1": 1, "key2": 2}',
        ]);
    });

    it("Should tokenize parantheses in quotes correctly", () => {
        var functionDefinition = 'def func(kwarg1="(abc):", kwarg2=\'[]]\', kwarg3="}}"):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg1="(abc):"',
            'kwarg2=\'[]]\'',
            'kwarg3="}}"',
        ]);
    });

    it("Should remove top level whitespace", () => {
        var functionDefinition = 'def func( kwarg1 = 1 , \narg, \targ2, kwarg2="\t\n "):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg1=1',
            'arg',
            'arg2',
            'kwarg2="\t\n "',
        ]);
    });

    it("Should handle weird but valid spacing", () => {
        var functionDefinition = 'def func   (    kwarg = 1) :';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg=1',
        ]);
    });

    it("Should handle string literals", () => {
        var functionDefinition = 'def func(kwarg = """\nsomething\n""") :';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'kwarg="""\nsomething\n"""',
        ]);
    });

    it("Should tokenize pep484 parameter and return types", () => {
        var functionDefinition = 'def func(arg: string, arg2: Callable[[], str]):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'arg:string',
            'arg2:Callable[[], str]',
        ]);
    });

    it("Should split class definition arguments", () => {
        var functionDefinition = 'class abc_c(arg, arg_2):';

        var result = tokenizeDefinition(functionDefinition);

        expect(result).to.have.ordered.members([
            'arg',
            'arg_2',
        ]);
    });

});
