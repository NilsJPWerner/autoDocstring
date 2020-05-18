// import { reverseMustache } from "reverse-mustache";
const reverseMustache = require("reverse-mustache");

export function parseDocstring(docstring: string, template: string) {
    const data = reverseMustache({
        template: template,
        content: docstring,
    });

    console.log(data);
}
