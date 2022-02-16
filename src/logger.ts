// Copyright (c) 2015 DonJayamanne. All rights reserved.
// Licensed under the MIT License.
// Code borrowed from https://github.com/DonJayamanne/gitHistoryVSCode

import * as vscode from "vscode";
import { extensionID } from "./constants";

let outLogChannel: vscode.OutputChannel;
const logLevel = vscode.workspace.getConfiguration(extensionID).get("logLevel");

export function getLogChannel() {
    if (outLogChannel === undefined) {
        outLogChannel = vscode.window.createOutputChannel("autoDocstring");
    }
    return outLogChannel;
}

export function logError(error: any) {
    getLogChannel().appendLine(`[ERROR ${getTimeAndMs()}] ${String(error)}`);
    getLogChannel().show();
    return vscode.window.showErrorMessage(
        "AutoDocstring encountered an error. Please view details in the 'autoDocstring' output window",
    );
}

export function logInfo(message: string) {
    if (logLevel === "Info" || logLevel === "Debug") {
        getLogChannel().appendLine(`[INFO ${getTimeAndMs()}] ${message}`);
    }
}

export function logDebug(message: string) {
    if (logLevel === "Debug") {
        getLogChannel().appendLine(`[DEBUG ${getTimeAndMs()}] ${message}`);
    }
}

function getTimeAndMs(): string {
    const time = new Date();
    const hours = `0${time.getHours()}`.slice(-2);
    const minutes = `0${time.getMinutes()}`.slice(-2);
    const seconds = `0${time.getSeconds()}`.slice(-2);
    const milliSeconds = `00${time.getMilliseconds()}`.slice(-3);
    return `${hours}:${minutes}:${seconds}.${milliSeconds}`;
}
