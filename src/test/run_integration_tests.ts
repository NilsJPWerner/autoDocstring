import * as path from "path";
import { runTests } from "@vscode/test-electron";

async function main() {
    console.log("Running Integration tests");
    const vscodeVersion = process.env.VSCODE_VERSION || "insiders";
    console.log("Using vscode version:", vscodeVersion);

    try {
        const extensionDevelopmentPath = path.resolve(__dirname, "../../");
        const extensionTestsPath = path.resolve(__dirname, "./integration/index");

        await runTests({
            version: vscodeVersion,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: ["--disable-extensions"],
        });
    } catch (err) {
        console.error("Failed to run tests");
        process.exit(1);
    }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
