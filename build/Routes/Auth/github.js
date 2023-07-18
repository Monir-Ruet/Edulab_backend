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
const passport_1 = __importDefault(require("passport"));
const authorization_1 = __importDefault(require("@/Routes/Auth/authorization"));
const httpexception_1 = __importDefault(require("@/Lib/Exception/httpexception"));
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
        }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.user;
                const { accessToken } = data;
                const { id, provider } = data.profile;
                let { name, email, avatar_url } = data.profile._json;
                let user;
                user = yield prismaClient_1.default.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: provider,
                            providerAccountId: id
                        }
                    }, select: {
                        provider: true,
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
                    if (email) {
                        user = yield prismaClient_1.default.user.findUnique({
                            where: {
                                email
                            }
                        });
                        if (user)
                            return next(new httpexception_1.default(400, 'There is another account with this email'));
                    }
                    user = yield prismaClient_1.default.account.create({
                        data: {
                            provider,
                            access_token: accessToken,
                            providerAccountId: id,
                            type: "Bearer",
                            user: {
                                create: {
                                    name,
                                    email: email != null ? email : undefined,
                                    image: avatar_url,
                                    email_verified: false,
                                }
                            }
                        }
                    });
                }
                if (!user)
                    next(new httpexception_1.default(500, 'Internal Server Error'));
                res.cookie('auth_token', authorization_1.default.GenerateJWTtoken(user), {
                    maxAge: 30 * 24 * 3600,
                    httpOnly: true,
                    secure: false,
                });
                res.redirect(process.env.CLIENT_URL);
            }
            catch (err) {
                console.log(err);
                res.sendStatus(401);
            }
        }));
    }
}
module.exports = new Github;
