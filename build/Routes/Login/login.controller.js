"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const login_validation_1 = __importDefault(require("./login.validation"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("@/Lib/Prisma/prismaClient"));
const authorization_1 = __importDefault(require("@/Routes/Auth/authorization"));
class Login {
    constructor() {
        this.path = 'login';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/', login_validation_1.default, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('Login');
            let { email, password } = req.body, name;
            let user = yield prismaClient_1.default.user.findUnique({
                where: {
                    email
                },
                select: {
                    name: true,
                    email: true,
                    password: true,
                    image: true
                }
            });
            if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                res.json({
                    "status": 401,
                    "message": "Invalid credential,Please try again."
                });
                return;
            }
            delete user.password;
            const payload = {
                provider: 'credential',
                providerAccountId: null,
                user
            };
            let token = authorization_1.default.GenerateJWTtoken(payload);
            res.cookie('auth_token', token, {
                maxAge: 30 * 24 * 3600,
                httpOnly: true,
                secure: false,
            });
            res.json({
                status: 200,
                auth_token: token
            });
        }));
    }
}
module.exports = new Login;
