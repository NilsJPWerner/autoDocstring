import { readFileSync, existsSync } from "fs";

export function getTemplate(docstringFormat: string): string {
    const fileName = docstringFormat + ".mustache";
    const filePath = __dirname + "/templates/" + fileName;

    // Default to docblockr
    if (!existsSync(filePath)) {
        readFileSync("docblockr.mustache", "utf8");
    }

    return readFileSync(filePath, "utf8");
}

// TODO: handle error case
export function getCustomTemplate(templateFilePath: string): string {
    return readFileSync(templateFilePath, "utf8");
}
