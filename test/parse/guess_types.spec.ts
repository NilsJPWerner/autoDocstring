import chai = require('chai');
import 'mocha';

import { guessType } from '../../src/parse/guess_types';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('guessType()', () => {

    context('when the parameter has pep484 type hints', () => {
        it("should get type from arg type hint", () => {
            var parameter = 'arg: int';
            var result = guessType(parameter);

            expect(result).to.equal('int');
        });

        it("should get type from composite type hint", () => {
            var parameter = 'arg: List[str]';
            var result = guessType(parameter);

            expect(result).to.equal('List[str]');
        });

        it("should get type from kwarg type hint", () => {
            var parameter = 'kwarg: color = "blue"';
            var result = guessType(parameter);

            expect(result).to.equal('color');
        });

        it("should get type when there is weird spacing", () => {
            var parameter = ' arg:    int ';
            var result = guessType(parameter);

            expect(result).to.equal('int');

            var parameter = ' arg  :\tstr ';
            var result = guessType(parameter);

            expect(result).to.equal('str');
        });
    });


    context('when the parameter is a kwarg', () => {
        it("should guess int type from default value", () => {
            var parameter = 'kwarg=1';
            var result = guessType(parameter);

            expect(result).to.equal('int');
        });

        it("should guess float type from default value", () => {
            var parameter = 'kwarg=2.0';
            var result = guessType(parameter);

            expect(result).to.equal('float');
        });

        it("should guess hexadecimal type from default value", () => {
            var parameter = 'kwarg=0xf00ff00';
            var result = guessType(parameter);

            expect(result).to.equal('hexadecimal');
        });

        it("should guess string type from default value", () => {
            var parameter = 'kwarg="abc()[]"';
            var result = guessType(parameter);

            expect(result).to.equal('str');
        });

        it("should guess bool type from default value", () => {
            var parameter = 'kwarg=True';
            var result = guessType(parameter);

            expect(result).to.equal('bool');
        });

        it("should guess list type from default value", () => {
            var parameter = 'kwarg=[(), ()]';
            var result = guessType(parameter);

            expect(result).to.equal('list');
        });

        it("should guess tuple type from default value", () => {
            var parameter = 'kwarg=([], {}, "abc")';
            var result = guessType(parameter);

            expect(result).to.equal('tuple');
        });

        it("should guess dict type from default value", () => {
            var parameter = 'kwarg={"ABC": [1,2]}';
            var result = guessType(parameter);

            expect(result).to.equal('dict');
        });

        it("should guess regexp type from default value", () => {
            var parameter = 'kwarg=r"abc"';
            var result = guessType(parameter);

            expect(result).to.equal('regexp');
        });

        it("should guess unicode type from default value", () => {
            var parameter = 'kwarg=u"abc"';
            var result = guessType(parameter);

            expect(result).to.equal('unicode');
        });

        it("should guess bytes type from default value", () => {
            var parameter = 'kwarg=b"abc"';
            var result = guessType(parameter);

            expect(result).to.equal('bytes');
        });

        it("should guess function type from default value", () => {
            var parameter = 'kwarg=lambda x: x + n';
            var result = guessType(parameter);

            expect(result).to.equal('function');
        });
    });

    context('when the parameter is an arg', () => {
        it("should guess bool type from arg name", () => {
            var parameter = 'isRed';
            var result = guessType(parameter);

            expect(result).to.equal('bool');
        });

        it("should guess function type from arg name", () => {
            var parameter = 'next';
            var result = guessType(parameter);

            expect(result).to.equal('function');
        });
    });

});
