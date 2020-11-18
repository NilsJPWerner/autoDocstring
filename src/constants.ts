// Will be set in extension activation.
type ExtensionRoot = { path?: string };
export const extensionRoot: ExtensionRoot = { path: "" };

export const debug = false;
export const extensionID = "autoDocstring";
export const generateDocstringCommand = "autoDocstring.generateDocstring";
export const updateDocstringCommand = "autoDocstring.updateDocstring";
