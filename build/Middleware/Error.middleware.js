"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ErrorMiddleware(error, req, res, next) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.json({
        status,
        message
    });
}
exports.default = ErrorMiddleware;
