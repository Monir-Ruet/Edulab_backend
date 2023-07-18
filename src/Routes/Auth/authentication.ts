import Controller from "@/Interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import Google from "@/Routes/Auth/google"
import Github from "@/Routes/Auth/github"
import credential from "@/Routes/Auth/credential"
import loggeduser from "./loggeduser";



class Authentication implements Controller {
    path: string;
    router: Router;
    constructor() {
        this.path = 'auth';
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter() {
        this.router.use('/' + Google.path, Google.router);
        this.router.use('/' + Github.path, Github.router);
        this.router.use('/' + credential.path, credential.router);
        this.router.use('/' + loggeduser.path, loggeduser.router);


        this.router.get('/logout', (req, res) => {
            res.cookie('auth_token', '', {
                maxAge: 1,
                httpOnly: true,
                secure: false,
            });
            res.redirect(process.env.CLIENT_URL as string);
        })
    }

}
export = new Authentication;
