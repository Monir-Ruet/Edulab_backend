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
const prismaClient_1 = __importDefault(require("@/Lib/Prisma/prismaClient"));
const authorization_1 = __importDefault(require("@/Routes/Auth/authorization"));
const httpexception_1 = __importDefault(require("@/Lib/Exception/httpexception"));
class User {
    constructor() {
        this.path = 'getuser';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/', authorization_1.default.isAuthorized, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.user;
            let user;
            if (payload && payload.provider && payload.provider == 'credential') {
                user = yield prismaClient_1.default.user.findUnique({
                    where: {
                        email: payload.user.email
                    }
                });
            }
            else {
                user = yield prismaClient_1.default.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: payload.provider,
                            providerAccountId: payload.providerAccountId
                        }
                    },
                    select: {
                        user: true
                    }
                });
                user = user === null || user === void 0 ? void 0 : user.user;
            }
            if (!user)
                return next(new httpexception_1.default(500, 'Internal Server Error'));
            const { name, email, image, email_verified, mobile_number, createdAt, updatedAt } = user;
            res.json({
                name,
                email,
                image,
                mobile_number,
                email_verified,
                createdAt,
                updatedAt
            });
        }));
    }
}
module.exports = new User;
