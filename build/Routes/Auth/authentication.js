"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const google_1 = __importDefault(require("@/Routes/Auth/google"));
const github_1 = __importDefault(require("@/Routes/Auth/github"));
const credential_1 = __importDefault(require("@/Routes/Auth/credential"));
const loggeduser_1 = __importDefault(require("./loggeduser"));
class Authentication {
    constructor() {
        this.path = 'auth';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.use('/' + google_1.default.path, google_1.default.router);
        this.router.use('/' + github_1.default.path, github_1.default.router);
        this.router.use('/' + credential_1.default.path, credential_1.default.router);
        this.router.use('/' + loggeduser_1.default.path, loggeduser_1.default.router);
        this.router.get('/logout', (req, res) => {
            res.cookie('auth_token', '', {
                maxAge: 1,
                httpOnly: true,
                secure: false,
            });
            res.redirect(process.env.CLIENT_URL);
        });
    }
}
module.exports = new Authentication;
