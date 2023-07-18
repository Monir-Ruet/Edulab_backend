"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
class Authentication {
    constructor() {
        this.path = 'auth';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        const CLIENT_URL = "http://localhost:3000/";
        this.router.get("/login/success", (req, res) => {
            if (req.user) {
                res.status(200).json({
                    success: true,
                    message: "successfull",
                    user: req.user,
                    //   cookies: req.cookies
                });
            }
        });
        this.router.get("/login/failed", (req, res) => {
            res.status(401).json({
                success: false,
                message: "failure",
            });
        });
        this.router.get("/logout", (req, res) => {
            req.logout({}, () => {
                res.redirect('/');
            });
            res.redirect(CLIENT_URL);
        });
        this.router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
        this.router.get("/google/callback", passport_1.default.authenticate("google", {
            session: false,
            failureRedirect: "/login/failed",
        }), (req, res) => {
            // res.status(200).send('dskl');
            // res.redirect(CLIENT_URL);
            res.cookie('jwt', 'skl', { httpOnly: true, secure: true });
            res.send({});
        });
        this.router.get("/profile", passport_1.default.authenticate("jwt", { session: false }), (req, res, next) => {
            res.send("Welcome");
        });
        this.router.get("/github", passport_1.default.authenticate("github", { scope: ["profile"] }));
        this.router.get("/github/callback", passport_1.default.authenticate("github", {
            successRedirect: CLIENT_URL,
            failureRedirect: "/login/failed",
        }));
        this.router.get("/facebook", passport_1.default.authenticate("facebook", { scope: ["profile"] }));
        this.router.get("/facebook/callback", passport_1.default.authenticate("facebook", {
            successRedirect: CLIENT_URL,
            failureRedirect: "/login/failed",
        }));
    }
}
module.exports = Authentication;
