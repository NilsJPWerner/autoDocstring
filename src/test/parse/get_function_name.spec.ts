import chai = require("chai");
import "mocha";

import { getFunctionName } from "../../parse";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getFunctionName()", () => {
    it("should get the function definition from a function", () => {
        const functionDefinition = 'def Func1_3(argument, kwarg="abc"):';
        const result = getFunctionName(functionDefinition);

        expect(result).to.eql("Func1_3");
    });

    it("should get the function definition from a function with weird spacing", () => {
        const functionDefinition = 'def  Func1  (argument, kwarg="abc"):';
        const result = getFunctionName(functionDefinition);

        expect(result).to.eql("Func1");
    });

});
