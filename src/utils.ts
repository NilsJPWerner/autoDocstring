import * as vs from "vscode";

export function inArray<type>(item: type, array: type[]) {
    return array.some((x) => item === x);
}

export function includesFromArray(str: string, substrings: string[]) {
    substrings.some((x) => str.includes(x));
}

export function deleteRange(range: vs.Range) {
    const wsEdit = new vs.WorkspaceEdit();
    const editor = vs.window.activeTextEditor;

    wsEdit.delete(editor.document.uri, range);
    vs.workspace.applyEdit(wsEdit);
}

export function deleteLine(lineNum: number) {
    const editor = vs.window.activeTextEditor;
    const line = editor.document.lineAt(lineNum);
    const wsEdit = new vs.WorkspaceEdit();
    wsEdit.delete(editor.document.uri, line.rangeIncludingLineBreak);
    vs.workspace.applyEdit(wsEdit);
}
