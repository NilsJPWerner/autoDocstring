import chai = require("chai");
import "mocha";

import { getDefaultIndentation, preprocessLines } from "../../parse/utilities";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe("getDefaultIndentation()", () => {
    it("should return 4 space indentation correctly", () => {
        const result = getDefaultIndentation(true, 4);

        expect(result).to.equal("    ");
    });

    it("should return 2 space indentation correctly", () => {
        const result = getDefaultIndentation(true, 2);

        expect(result).to.equal("  ");
    });

    it("should return tab indentation correctly", () => {
        let result = getDefaultIndentation(false, 4);

        expect(result).to.equal("\t");

        result = getDefaultIndentation(false, 8);

        expect(result).to.equal("\t");
    });
});

describe("preprocessLines()", () => {
    it('should trim lines passed.', () => {
        const result = preprocessLines([
            '    foo    ',
            '\t\tbar\t\t',
            '\r\rbatz\r\r',
            '\t\rhello\t\r',
            '\t\t    \r\t  world\t\r  \r\t  '
        ]);
        expect(result).to.be.deep.equal([
            'foo',
            'bar',
            'batz',
            'hello',
            'world'
        ]);
    });

    it('should discard comments.', () => {
        const result = preprocessLines([
            'foo',
            '# hello world'
        ]);
        expect(result).to.be.deep.equal([
            'foo'
        ]);
    });
});
