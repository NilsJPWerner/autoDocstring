// import { reverseMustache } from "reverse-mustache";
// const reverseMustache = require("reverse-mustache");
import { diffLines } from "Diff";

export function parseDocstring(oldDocstring: string, newDocstring: string) {
    const data = diffLines(oldDocstring, newDocstring);

    console.log(data);
}
