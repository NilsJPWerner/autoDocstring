import chai = require("chai");
import fs = require("fs");
import "mocha";
import * as path from "path";
import * as vsc from "vscode";
import { generateDocstringCommand } from "../../constants";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

/** Extension identifier. */
const identifier = "njpwerner.autodocstring";
const settingsIdentifier = "autoDocstring";

describe("Basic Integration Tests", function () {
    this.timeout(30000);
    vsc.window.showInformationMessage("Start all tests.");

    it("should have installed successfully", () => {
        expect(vsc.extensions.getExtension(identifier)).to.not.equal(undefined);
    });

    it("should not be activated on startup", () => {
        const extension = vsc.extensions.getExtension(identifier);
        expect(extension.isActive).to.equal(false);
    });

    describe("Completion Item", function () {
        const extension = vsc.extensions.getExtension(identifier);
        let document: vsc.TextDocument;
        let editor: vsc.TextEditor;

        beforeEach(async function () {
            const settings = vsc.workspace.getConfiguration(settingsIdentifier);
            await Promise.all([
                settings.update("generateDocstringOnEnter", true, true),
                settings.update("quoteStyle", '"""', true),
            ]);
            await extension.activate();

            document = await vsc.workspace.openTextDocument({ language: "python" });
            editor = await vsc.window.showTextDocument(document);
        });

        it("will activate the Generate Docstring completion item after triple quotes", async function () {
            await editor.edit((edit) => edit.setEndOfLine(vsc.EndOfLine.LF));

            await editor.edit((edit) => {
                edit.insert(new vsc.Position(0, 0), '\n    """');
            });

            await vsc.commands.executeCommand("editor.action.triggerSuggest");
            await delay(200);
            await vsc.commands.executeCommand("acceptSelectedSuggestion");
            await delay(600);
            expect(document.getText()).to.contain("[summary]");
        });

        it("will activate the Generate Docstring completion item after triple single quotes", async function () {
            const settings = vsc.workspace.getConfiguration(settingsIdentifier);
            await settings.update("quoteStyle", "'''", true);

            await editor.edit((edit) => {
                edit.insert(new vsc.Position(0, 0), "\n    '''");
            });

            await vsc.commands.executeCommand("editor.action.triggerSuggest");
            await delay(200);
            await vsc.commands.executeCommand("acceptSelectedSuggestion");
            await delay(600);
            expect(document.getText()).to.contain("[summary]");
        });

        it("will activate the Generate Docstring completion item if using CRLF line endings", async function () {
            await editor.edit((edit) => edit.setEndOfLine(vsc.EndOfLine.CRLF));

            await editor.edit((edit) => {
                edit.insert(new vsc.Position(0, 0), '\r\n    """');
            });

            await vsc.commands.executeCommand("editor.action.triggerSuggest");
            await delay(200);
            await vsc.commands.executeCommand("acceptSelectedSuggestion");
            await delay(600);
            expect(document.getText()).to.contain("[summary]");
        });
    });

    describe("Docstring Generation", function () {
        const extension = vsc.extensions.getExtension(identifier);

        before(async function () {
            const settings = vsc.workspace.getConfiguration(settingsIdentifier);
            await Promise.all([
                settings.update("docstringFormat", "sphinx", true),
                settings.update("includeExtendedSummary", false, true),
                settings.update("guessTypes", true, true),
                settings.update("quoteStyle", '"""', true),
            ]);

            await extension.activate();
        });

        it("generates a docstring for the function in file 1", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_1_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_1.py"),
                position: new vsc.Position(2, 0),
            });
        });

        it("generates a docstring using type hints in file 2", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_2_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_2.py"),
                position: new vsc.Position(8, 0),
            });
        });

        it("ignores the comments in file 3", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_3_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_3.py"),
                position: new vsc.Position(2, 0),
            });
        });

        it("Deals with type hints split across lines in file 4", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_4_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_4.py"),
                position: new vsc.Position(5, 0),
            });
        });

        it("Correctly indents docstring for empty function in file 5", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_5_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_5.py"),
                position: new vsc.Position(8, 0),
            });
        });

        it("Respects the tabbed indentation in the empty function in file 6", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_6_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_6.py"),
                position: new vsc.Position(4, 0),
            });
        });

        it("generates class docstring by parsing __init__ in file 7", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_7_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_7.py"),
                position: new vsc.Position(1, 0),
            });
        });

        it("generates module docstring by parsing document and listting classes and methods in file 8", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_8_output.py",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_8.py"),
                position: new vsc.Position(0, 0),
            });
        });

        it("generates a docstring for the starlark function", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_starlark_output.sky",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_starlark.sky"),
                position: new vsc.Position(2, 0),
            });
        });

        it("generates a docstring for the bazel macro", async function () {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(
                    __dirname,
                    "./python_test_files/file_bazel_output.bzl",
                ),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_bazel.bzl"),
                position: new vsc.Position(2, 0),
            });
        });
    });
});

async function testDocstringGeneration(testCase: TestCase) {
    const inputDocument = await vsc.workspace.openTextDocument(testCase.inputFilePath);
    const expectedOutput = fs.readFileSync(testCase.expectedOutputFilePath, "utf8");

    await vsc.window.showTextDocument(inputDocument);
    vsc.window.activeTextEditor.selection = new vsc.Selection(testCase.position, testCase.position);

    const success = await vsc.commands.executeCommand(generateDocstringCommand);
    expect(success).to.equal(true);

    const documentText = vsc.window.activeTextEditor.document.getText();
    expect(documentText).to.equal(expectedOutput);
}

interface TestCase {
    inputFilePath: string;
    position: vsc.Position;
    expectedOutputFilePath: string;
}

function delay(timeout) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeout);
    });
}
