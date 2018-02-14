import { expect } from 'chai';
import 'mocha';

import { guessType } from '../../src/parse/guess_type';

describe('guessType', () => {

    it("Should get arg type from pep484 type hints", () => {
        var parameter = 'arg: int';

        var result = guessType(parameter);

        expect(result).to.equal('int');
    });

    it("Should get arg type from composite pep484 type hints", () => {
        var parameter = 'arg: List[str]';

        var result = guessType(parameter);

        expect(result).to.equal('List[str]');
    });

    it("Should get kwarg int type from value", () => {
        var parameter = 'arg: List[str]';

        var result = guessType(parameter);

        expect(result).to.equal('List[str]');
    });




    it("Should guess bool type from name", () => {
        var parameter = 'isRed';

        var result = guessType(parameter);

        expect(result).to.equal('bool');
    });

    it("Should guess function type from name", () => {
        var parameter = 'nextThing';

        var result = guessType(parameter);

        expect(result).to.equal('function');
    });

});
