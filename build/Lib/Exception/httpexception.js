"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpStatus extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}
exports.default = HttpStatus;
