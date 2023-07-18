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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_validation_1 = __importDefault(require("@/Routes/Signup/signup.validation"));
const httpexception_1 = __importDefault(require("@/Lib/Exception/httpexception"));
const encryption_bcrypt_1 = require("@/Routes/Services/encryption.bcrypt");
const prismaClient_1 = __importDefault(require("@/Lib/Prisma/prismaClient"));
class Singup {
    constructor() {
        this.path = 'signup';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/', signup_validation_1.default, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { name, email, password } = req.body;
            const user = yield prismaClient_1.default.user.findUnique({
                where: {
                    email
                }
            });
            if (!user) {
                try {
                    password = yield (0, encryption_bcrypt_1.Encrypt)(password);
                    yield prismaClient_1.default.user.create({
                        data: {
                            name,
                            email,
                            email_verified: false,
                            password
                        }
                    });
                    return next(new httpexception_1.default(200, 'Account created successfully'));
                }
                catch (err) {
                    return next(err);
                }
            }
            else {
                return next(new httpexception_1.default(400, 'There is an account with this username / email'));
            }
        }));
    }
}
exports.default = new Singup;
