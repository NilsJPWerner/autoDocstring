import chai = require("chai");
import "mocha";

import { guessType } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("guessType()", () => {
    context("when the parameter has pep484 type hints", () => {
        it("should get type from arg type hint", () => {
            const parameter = "arg: int";
            const result = guessType(parameter);

            expect(result).to.equal("int");
        });

        it("should get type from quoted arg type hint", () => {
            const parameter = "arg: 'int'";
            const result = guessType(parameter);

            expect(result).to.equal("int");
        });

        it("should get type from composite type hint", () => {
            const parameter = "arg: List[str]";
            const result = guessType(parameter);

            expect(result).to.equal("List[str]");
        });

        it("should get type from kwarg type hint", () => {
            const parameter = 'kwarg: color = "blue"';
            const result = guessType(parameter);

            expect(result).to.equal("color");
        });

        it("should get type when there is weird spacing", () => {
            const parameter = " arg:    int ";
            const result = guessType(parameter);

            expect(result).to.equal("int");

            const parameter2 = " arg  :\tstr ";
            const result2 = guessType(parameter2);

            expect(result2).to.equal("str");
        });

        it("should get type from PEP 604 style type hint", () => {
            const parameter = "arg: int | str";
            const result = guessType(parameter);

            expect(result).to.equal("int | str");
        });

        it("should get type from args with Literal type hints", () => {
            const parameter = `param1: Literal["foo"]`;
            const result = guessType(parameter);

            expect(result).to.equal(`Literal["foo"]`);
        });

        it("should get type from kwargs with Literal type hint", () => {
            const parameter = `param2: Literal['bar'] = "bar"`;
            const result = guessType(parameter);

            expect(result).to.equal(`Literal['bar']`);
        });

        it("should get type from hint containing nested square brackets", () => {
            const parameter = `a: Callable[[NDArray[(Any,), float]], float]`;
            const result = guessType(parameter);

            expect(result).to.equal(`Callable[[NDArray[(Any,), float]], float]`);
        });

        it("should get type from hint with nested brackets and default value", () => {
            const parameter = `a: NDArray[(Any,), float] = np.zeros(10,)`;
            const result = guessType(parameter);

            expect(result).to.equal(`NDArray[(Any,), float]`);
        });
    });

    context("when the parameter is a kwarg", () => {
        it("should guess int type from default value", () => {
            const parameter = "kwarg=1";
            const result = guessType(parameter);

            expect(result).to.equal("int");
        });

        it("should guess float type from default value", () => {
            const parameter = "kwarg=2.0";
            const result = guessType(parameter);

            expect(result).to.equal("float");
        });

        it("should guess hexadecimal type from default value", () => {
            const parameter = "kwarg=0xf00ff00";
            const result = guessType(parameter);

            expect(result).to.equal("hexadecimal");
        });

        it("should guess string type from default value", () => {
            const parameter = 'kwarg="abc()[]"';
            const result = guessType(parameter);

            expect(result).to.equal("str");
        });

        it("should guess bool type from default value", () => {
            const parameter = "kwarg=True";
            const result = guessType(parameter);

            expect(result).to.equal("bool");
        });

        it("should guess list type from default value", () => {
            const parameter = "kwarg=[(), ()]";
            const result = guessType(parameter);

            expect(result).to.equal("list");
        });

        it("should guess tuple type from default value", () => {
            const parameter = 'kwarg=([], {}, "abc")';
            const result = guessType(parameter);

            expect(result).to.equal("tuple");
        });

        it("should guess dict type from default value", () => {
            const parameter = 'kwarg={"ABC": [1,2]}';
            const result = guessType(parameter);

            expect(result).to.equal("dict");
        });

        it("should guess regexp type from default value", () => {
            const parameter = 'kwarg=r"abc"';
            const result = guessType(parameter);

            expect(result).to.equal("regexp");
        });

        it("should guess unicode type from default value", () => {
            const parameter = 'kwarg=u"abc"';
            const result = guessType(parameter);

            expect(result).to.equal("unicode");
        });

        it("should guess bytes type from default value", () => {
            const parameter = 'kwarg=b"abc"';
            const result = guessType(parameter);

            expect(result).to.equal("bytes");
        });

        it("should guess function type from default value", () => {
            const parameter = "kwarg=lambda x: x + n";
            const result = guessType(parameter);

            expect(result).to.equal("function");
        });
    });

    context("when the parameter is an arg", () => {
        it("should guess bool type from arg name", () => {
            const parameter = "isRed";
            const result = guessType(parameter);

            expect(result).to.equal("bool");
        });

        it("should guess function type from arg name", () => {
            const parameter = "next";
            const result = guessType(parameter);

            expect(result).to.equal("function");
        });
    });
});
