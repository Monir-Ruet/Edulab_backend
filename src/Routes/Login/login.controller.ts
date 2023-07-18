import Controller from "@/Interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import loginValidation from "./login.validation";
import bcrypt from 'bcrypt';
import prisma from "@/Lib/Prisma/prismaClient";
import JWTHandler from '@/Routes/Auth/authorization'

interface user {
    name: String,
    email: String,
    password?: String,
    image?: String
}
class Login implements Controller {
    path: string;
    router: Router;
    constructor() {
        this.path = 'login';
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter() {
        this.router.post('/', loginValidation, async (req: Request, res: Response, next: NextFunction) => {
            console.log('Login');
            let { email, password } = req.body, name;
            let user = <user>await prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    name: true,
                    email: true,
                    password: true,
                    image: true
                }
            })
            if (!user || !(await bcrypt.compare(password, user.password as string))) {
                res.json({
                    "status": 401,
                    "message": "Invalid credential,Please try again."
                })
                return;
            }
            delete user.password;
            const payload = {
                provider: 'credential',
                providerAccountId: null,
                user
            }
            let token = JWTHandler.GenerateJWTtoken(payload);
            res.cookie('auth_token', token, {
                maxAge: 30 * 24 * 3600,
                httpOnly: true,
                secure: false,
            });
            res.json({
                status: 200,
                auth_token: token
            })
        })
    }

}
export = new Login;
