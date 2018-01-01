import * as vs from 'vscode';

export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}

export function includesFromArray(string: string, substrings: string[]) {
    substrings.some(x => string.includes(x))
}

export function deleteRange(range: vs.Range) {
    const ws_edit = new vs.WorkspaceEdit();
    const editor = vs.window.activeTextEditor;

    ws_edit.delete(editor.document.uri, range);
    vs.workspace.applyEdit(ws_edit);
}

export function deleteLine(line_num: number) {
    const editor = vs.window.activeTextEditor;
    const line = editor.document.lineAt(line_num);
    const ws_edit = new vs.WorkspaceEdit();
    ws_edit.delete(editor.document.uri, line.rangeIncludingLineBreak)
    vs.workspace.applyEdit(ws_edit);
}
