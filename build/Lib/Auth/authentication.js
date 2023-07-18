"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const google_1 = __importDefault(require("@/Lib/Auth/google"));
const github_1 = __importDefault(require("@/Lib/Auth/github"));
class Authentication {
    constructor() {
        this.path = 'auth';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.use('/' + google_1.default.path, google_1.default.router);
        this.router.use('/' + github_1.default.path, github_1.default.router);
    }
}
module.exports = Authentication;
