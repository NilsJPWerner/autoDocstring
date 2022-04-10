import * as glob from "glob";
import * as Mocha from "mocha";
import * as path from "path";

export function run(): Promise<void> {
    // Create the mocha test
    const mocha = new Mocha({
        ui: "bdd",
    });
    mocha.options.color = true;

    const testsRoot = path.resolve(__dirname, "..");

    return new Promise((c, e) => {
        glob("**/**.test.js", { cwd: testsRoot }, (err: Error, files: string[]) => {
            if (err) {
                return e(err);
            }

            // Add files to the test suite
            files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                // Run the mocha test
                mocha.run((failures) => {
                    if (failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    } else {
                        c();
                    }
                });
            } catch (err2) {
                console.error(err2);
                e(err2);
            }
        });
    });
}
