import chai = require('chai');
import 'mocha';

import { getFunctionName } from '../../src/parse/get_function_name';

chai.config.truncateThreshold = 0;
let expect = chai.expect;

describe('getFunctionName()', () => {
    it("should get the function definition from a function", () => {
        var functionDefinition = 'def Func1_3(argument, kwarg="abc"):';
        var result = getFunctionName(functionDefinition);

        expect(result).to.eql('Func1_3');
    });

    it("should get the function definition from a function with weird spacing", () => {
        var functionDefinition = 'def  Func1  (argument, kwarg="abc"):';
        var result = getFunctionName(functionDefinition);

        expect(result).to.eql('Func1');
    });

});
