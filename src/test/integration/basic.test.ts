import chai = require("chai");
import fs = require("fs");
import "mocha";
import * as path from "path";
import * as vscode from "vscode";
import { generateDocstringCommand } from "../../extension";

chai.config.truncateThreshold = 0;
const expect = chai.expect;

/** Extension identifier. */
const identifier = "njpwerner.autodocstring";
const settingsIdentifier = "autoDocstring";

describe("Basic Integration Tests", function() {
    this.timeout(10000);
    vscode.window.showInformationMessage("Start all tests.");

    it("should have installed successfully", () => {
        expect(vscode.extensions.getExtension(identifier)).to.not.equal(undefined);
    });

    it("should not be activated on startup", () => {
        const extension = vscode.extensions.getExtension(identifier);
        expect(extension.isActive).to.equal(false);
    });

    context("When a python file is opened", () => {
        const extension = vscode.extensions.getExtension(identifier);
        let basicDocument: vscode.TextDocument;

        before("open test files", async () => {
            basicDocument = await Promise.resolve(
                vscode.workspace.openTextDocument(path.resolve(__dirname, "./python_test_files/file_1.py")),
            );
        });

        it("should activate", async () => {
            return new Promise((resolve): void => {
                setTimeout((): void => {
                    if (extension.isActive) {
                        resolve();
                    }
                }, 4);
            });
        });
    });

    describe("Docstring Generation", function() {
        const extension = vscode.extensions.getExtension(identifier);

        before(async function() {
            const settings = vscode.workspace.getConfiguration(settingsIdentifier);
            await Promise.all([
                settings.update("docstringFormat", "sphinx", 1),
                settings.update("includeExtendedSummary", false, 1),
                settings.update("guessTypes", true, 1),
            ]);

            await extension.activate();
        });

        it("generates a docstring for the function in file 1", async function() {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(__dirname, "./python_test_files/file_1_output.py"),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_1.py"),
                position: new vscode.Position(2, 0),
            });
        });

        it("generates a docstring using type hints in file 2", async function() {
            await testDocstringGeneration({
                expectedOutputFilePath: path.resolve(__dirname, "./python_test_files/file_2_output.py"),
                inputFilePath: path.resolve(__dirname, "./python_test_files/file_2.py"),
                position: new vscode.Position(8, 0),
            });
        });
    });

});

async function testDocstringGeneration(testCase: TestCase) {
    const inputDocument = await vscode.workspace.openTextDocument(testCase.inputFilePath);
    const expectedOutput = fs.readFileSync(testCase.expectedOutputFilePath, "utf8");

    await vscode.window.showTextDocument(inputDocument);
    vscode.window.activeTextEditor.selection = new vscode.Selection(testCase.position, testCase.position);

    const success = await vscode.commands.executeCommand(generateDocstringCommand);
    expect(success).to.equal(true);

    const documentText = vscode.window.activeTextEditor.document.getText();
    expect(documentText).to.equal(expectedOutput);
}

interface TestCase {
    inputFilePath: string;
    position: vscode.Position;
    expectedOutputFilePath: string;
}
