import Controller from "@/Interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import prisma from '@/Lib/Prisma/prismaClient'
import passport from "passport";
import JWTHandler from '@/Routes/Auth/authorization'
import HttpException from "@/Lib/Exception/httpexception";


class Google implements Controller {
    path: string;
    router: Router;
    constructor() {
        this.path = 'google';
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter() {
        this.router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

        this.router.get(
            "/callback",
            passport.authenticate("google", {
                session: false,
                failureRedirect: "/login/failed",
            }),
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const data = req.user as any
                    const { accessToken } = data;
                    const { id, provider } = data.profile;
                    const { name, email, email_verified, picture } = data.profile._json;
                    let user;
                    user = await prisma.account.findUnique({
                        where: {
                            provider_providerAccountId: {
                                provider: "google",
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
                    })
                    if (!user) {
                        if (email) {
                            user = await prisma.user.findUnique({
                                where: {
                                    email
                                }
                            })
                            if (user) return next(new HttpException(400, 'There is another account with this email'));
                        }
                        user = await prisma.account.create({
                            data: {
                                provider,
                                access_token: accessToken,
                                providerAccountId: id,
                                type: "Bearer",
                                user: {
                                    create: {
                                        name,
                                        email,
                                        image: picture,
                                        email_verified: false,
                                    }
                                }
                            },
                            select: {
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
                        })
                    }
                    if (!user) next(new HttpException(500, 'Internal Server Error'));

                    res.cookie('auth_token', JWTHandler.GenerateJWTtoken(user), {
                        maxAge: 30 * 24 * 3600,
                        httpOnly: true,
                        secure: false,
                    });
                    res.redirect(process.env.CLIENT_URL as string);
                }
                catch (err) {
                    return next(new HttpException(401, 'There is an account with this email. Please try with different email'))
                }
            }
        );
    }
}
export = new Google;