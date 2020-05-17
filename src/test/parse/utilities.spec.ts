import chai = require("chai");
import "mocha";

import { getDefaultIndentation } from "../../parse";

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
