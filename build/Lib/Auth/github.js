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
const prismaClient_1 = __importDefault(require("../Prisma/prismaClient"));
const passport_1 = __importDefault(require("passport"));
const authorization_1 = __importDefault(require("@/Lib/Auth/authorization"));
class Github {
    constructor() {
        this.path = 'github';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.get("/", passport_1.default.authenticate("github", { scope: ['read:user'] }));
        this.router.get("/callback", passport_1.default.authenticate("github", {
            session: false,
            failureRedirect: "/login/failed",
        }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.user;
                const { accessToken } = data;
                const { id, provider } = data.profile;
                let { name, email, avatar_url } = data.profile._json;
                let user;
                user = yield prismaClient_1.default.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: "github",
                            providerAccountId: id
                        }
                    }, select: {
                        providerAccountId: true,
                        user: {
                            select: {
                                email: true,
                                name: true,
                                image: true,
                            }
                        }
                    }
                });
                if (!user) {
                    if (!email)
                        email = '';
                    user = yield prismaClient_1.default.user.create({
                        data: {
                            name,
                            email,
                            "image": avatar_url,
                            email_verified: false,
                            Account: {
                                create: {
                                    provider,
                                    access_token: accessToken,
                                    providerAccountId: id,
                                    type: "Bearer",
                                }
                            }
                        }
                    });
                }
                res.cookie('auth_token', authorization_1.default.GenerateJWTtoken(user), {
                    maxAge: 30 * 24 * 3600,
                    httpOnly: true,
                    secure: false,
                });
                res.redirect(process.env.CLIENT_URL);
            }
            catch (err) {
                res.sendStatus(401);
            }
        }));
    }
}
module.exports = new Github;
