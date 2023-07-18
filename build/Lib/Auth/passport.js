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
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const passport_github2_1 = require("passport-github2");
const GOOGLE_CLIENT_ID = "45352865368-ks24s4lvhcii9bccrq8ejdmdq6i7b4ur.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GITHUB_CLIENT_ID = "d852f3fd1b33611cc0c9";
const GITHUB_CLIENT_SECRET = "bdd28de8d7762779ba28ee5a26d142d9efd06a2d";
passport_1.default.use("google", new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, function (accessToken, refreshToken, profile, done) {
    const account = {
        accessToken,
        profile
    };
    done(null, account);
}));
passport_1.default.use("github", new passport_github2_1.Strategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, function (accessToken, refreshToken, profile, done) {
    const account = {
        accessToken,
        profile
    };
    done(null, account);
}));
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromHeader("authorization"),
    secretOrKey: "secretKjsdjsldajsdkley",
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // <em>// Extract user</em> 
        const user = jwtPayload.user;
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
