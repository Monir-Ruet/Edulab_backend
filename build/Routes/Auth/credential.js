"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("@/Lib/Prisma/prismaClient"));
const authorization_1 = __importDefault(require("@/Routes/Auth/authorization"));
const Joi = __importStar(require("joi"));
const validation_service_1 = __importDefault(require("../Services/validation.service"));
const LoginSchema = Joi.object({
    email: Joi.string().min(5).required(),
    password: Joi.string().min(6).required()
});
class credentialLogin {
    constructor() {
        this.path = 'credential';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/', (0, validation_service_1.default)(LoginSchema), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
module.exports = new credentialLogin;
