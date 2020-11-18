import chai = require("chai");
import "mocha";

import { normalizeDocstring } from "../../../parse/docstring/normalize_docstring";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe.only("normalizeDocstring()", () => {
    it("should remove indentation and quotes of a one line docstring", () => {
        const result = normalizeDocstring(oneLineDocstring);

        expect(result).to.equal("A docstring");
    });

    it("should preserve the relative indentation", () => {
        const result = normalizeDocstring(largeDocstring);

        expect(result).to.equal(
            [
                "[summary]",
                "",
                "Args:",
                "    a ([type]): [description]",
                "    b (int, optional): [description]. Defaults to 1.",
                "",
                "Returns:",
                "    Tuple[int, d]: [description]",
                "",
            ].join("\n"),
        );
    });

    it("should remove the minimum indentation", () => {
        const result = normalizeDocstring(indentedDocstring);

        expect(result).to.equal(
            [
                "[summary]",
                "",
                "Args:",
                "    a ([type]): [description]",
                "    b (int, optional): [description]. Defaults to 1.",
                "",
                "Returns:",
                "    Tuple[int, d]: [description]",
                "",
            ].join("\n"),
        );
    });

    it("should handle single quotes", () => {
        const result = normalizeDocstring(singleQuoteDocstring);

        expect(result).to.equal("A docstring");
    });
});

const oneLineDocstring = `\
    """A docstring"""`;

const largeDocstring = `\
    """[summary]

    Args:
        a ([type]): [description]
        b (int, optional): [description]. Defaults to 1.

    Returns:
        Tuple[int, d]: [description]
    """`;

const indentedDocstring = `\
        """[summary]

        Args:
            a ([type]): [description]
            b (int, optional): [description]. Defaults to 1.

        Returns:
            Tuple[int, d]: [description]
        """`;

const singleQuoteDocstring = `'''A docstring'''`;
