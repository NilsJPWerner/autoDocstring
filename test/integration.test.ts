import * as assert from 'assert';
import * as vscode from 'vscode';
// import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
describe("Extension Tests", () => {

    // Defines a Mocha unit test
    test("Something 1", () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });
});
