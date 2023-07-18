"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function runCommand(command, timeOut) {
    command = 'cd source && ' + command;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, { maxBuffer: 100000000, timeout: timeOut }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        });
    });
}
function a() {
}
exports.default = runCommand;
