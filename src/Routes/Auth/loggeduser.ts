import Controller from "@/Interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import prisma from '@/Lib/Prisma/prismaClient'
import JWTHandler from '@/Routes/Auth/authorization'
import HttpException from "@/Lib/Exception/httpexception";


interface payload {
    provider: string,
    providerAccountId: string | null,
    user: {
        name: string,
        email: string,
        image: string | null
    }
}
class User implements Controller {
    path: string;
    router: Router;
    constructor() {
        this.path = 'getuser';
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter() {
        this.router.post('/', JWTHandler.isAuthorized, async (req: Request, res: Response, next: NextFunction) => {
            const payload = <payload>req.user;
            let user;
            if (payload && payload.provider && payload.provider == 'credential') {
                user = await prisma.user.findUnique({
                    where: {
                        email: payload.user.email
                    }
                })
            } else {
                user = await prisma.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: payload.provider,
                            providerAccountId: payload.providerAccountId as string
                        }
                    },
                    select: {
                        user: true
                    }
                })
                user = user?.user
            }
            if (!user) return next(new HttpException(500, 'Internal Server Error'));
            const { name, email, image, email_verified, mobile_number, createdAt, updatedAt } = user
            res.json({
                name,
                email,
                image,
                mobile_number,
                email_verified,
                createdAt,
                updatedAt
            });

        })
    }
}
export = new User