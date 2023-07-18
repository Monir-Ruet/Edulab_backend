import Controller from "@/Interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import signupValidation from "@/Routes/Signup/signup.validation";
import HttpException from "@/Lib/Exception/httpexception";
import { Encrypt } from '@/Routes/Services/encryption.bcrypt';
import prisma from "@/Lib/Prisma/prismaClient";

class Singup implements Controller {
    path: string;
    router: Router;
    constructor() {
        this.path = 'signup';
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter() {
        this.router.post('/', signupValidation, async (req: Request, res: Response, next: NextFunction) => {
            let { name, email, password } = req.body
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (!user) {
                try {
                    password = await Encrypt(password);
                    await prisma.user.create({
                        data: {
                            name,
                            email,
                            email_verified: false,
                            password
                        }
                    })
                    return next(new HttpException(200, 'Account created successfully'));
                }
                catch (err) {
                    return next(err);
                }
            } else {
                return next(new HttpException(400, 'There is an account with this username / email'));
            }
        })
    }
}
export default new Singup;