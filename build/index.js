"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("module-alias/register");
require("dotenv/config");
const login_controller_1 = __importDefault(require("@/Routes/Login/login.controller"));
const authentication_1 = __importDefault(require("@/Routes/Auth/authentication"));
require("@/Routes/Auth/passport");
const signup_controllers_1 = __importDefault(require("@/Routes/Signup/signup.controllers"));
const post_controller_1 = __importDefault(require("@/Routes/Post/post.controller"));
const controller = [login_controller_1.default, authentication_1.default, signup_controllers_1.default, post_controller_1.default];
const app = new app_1.default(controller, Number(process.env.PORT));
app.listen();
