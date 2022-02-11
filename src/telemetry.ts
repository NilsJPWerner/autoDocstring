// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Code borrowed from https://github.com/microsoft/vscode-python

import { parse } from "stack-trace";
import { basename as pathBasename, sep as pathSep } from "path";
import { extensionRoot, debug } from "./constants";

export function getStackTrace(ex: Error): string {
    // We aren't showing the error message (ex.message) since it might
    // contain PII.
    let trace = "\t";
    for (const frame of parse(ex)) {
        let filename = frame.getFileName();
        if (filename) {
            if (!debug && !isExtensionFile(filename)) {
                continue;
            }
            filename = sanitizeFilename(filename);
            const lineno = frame.getLineNumber();
            const colno = frame.getColumnNumber();
            trace += `\n\tat ${getCallSite(frame)} ${filename}:${lineno}:${colno}`;
        } else {
            trace += "\n\tat <anonymous>";
        }
    }
    // Ensure we always use `/` as path separators.
    // This way stack traces (with relative paths) coming from different OS will always look the same.
    return trace.trim().replace(/\\/g, "/");
}

function isExtensionFile(filename: string): boolean {
    const extensionPath = extensionRoot.path;
    if (!extensionPath) {
        return true;
    }
    return filename.startsWith(extensionPath);
}

function sanitizeFilename(filename: string): string {
    const extensionPath = extensionRoot.path;
    if (!extensionPath) {
        return "<hidden_no_extension_root>";
    }
    if (filename.startsWith(extensionPath)) {
        filename = `<autoDocstring>${filename.substring(extensionPath.length)}`;
    } else {
        // We don't really care about files outside our extension.
        filename = `<hidden>${pathSep}${pathBasename(filename)}`;
    }
    return filename;
}

function sanitizeName(name: string): string {
    if (name.indexOf("/") === -1 && name.indexOf("\\") === -1) {
        return name;
    } else {
        return "<hidden>";
    }
}

function getCallSite(frame: stackTrace.StackFrame) {
    const parts: string[] = [];
    if (typeof frame.getTypeName() === "string" && frame.getTypeName().length > 0) {
        parts.push(frame.getTypeName());
    }
    if (typeof frame.getMethodName() === "string" && frame.getMethodName().length > 0) {
        parts.push(frame.getMethodName());
    }
    if (typeof frame.getFunctionName() === "string" && frame.getFunctionName().length > 0) {
        if (parts.length !== 2 || parts.join(".") !== frame.getFunctionName()) {
            parts.push(frame.getFunctionName());
        }
    }
    return parts.map(sanitizeName).join(".");
}
