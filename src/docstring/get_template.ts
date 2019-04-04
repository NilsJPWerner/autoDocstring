import {readFileSync} from 'fs';

export function getTemplate(templateName: string): string {
    switch (templateName) {
        case "google":
            return getTemplateFile("google.mustache")
        case "sphinx":
            return getTemplateFile("sphinx.mustache")
        case "numpy":
            return getTemplateFile("numpy.mustache")
        default:
            return getTemplateFile("default.mustache")
    }
}

// export function getCustomTemplate(templateFileLocation: string): string {

// }

function getTemplateFile(fileName: string): string {
    let filePath = __dirname + "/templates/" + fileName
    return readFileSync(filePath, "utf8");
}
