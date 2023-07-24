import App from "./app";
import Controller from "@/Interfaces/controller.interface";
import 'module-alias/register'
import 'dotenv/config'
import Login from "@/Routes/Login/login.controller";
import Authentication from "@/Routes/Auth/authentication";
import '@/Routes/Auth/passport'
import Singup from "@/Routes/Signup/signup.controllers";
import Post from "@/Routes/Post/post.controller";


const controller: Controller[] = [Login, Authentication, Singup, Post];
const app = new App(controller, Number(process.env.PORT));
app.listen();