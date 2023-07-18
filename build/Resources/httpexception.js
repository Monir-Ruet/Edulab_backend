"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}
exports.default = HttpException;
