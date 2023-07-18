import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
const GOOGLE_CLIENT_ID = "45352865368-ks24s4lvhcii9bccrq8ejdmdq6i7b4ur.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GITHUB_CLIENT_ID = "d852f3fd1b33611cc0c9";
const GITHUB_CLIENT_SECRET = "bdd28de8d7762779ba28ee5a26d142d9efd06a2d"


passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            callbackURL: "/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            const account = {
                accessToken,
                profile
            }
            done(null, account);
        }
    )
);

passport.use(
    "github",
    new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback"
    },
        function (accessToken: any, refreshToken: any, profile: any, done: any) {
            const account = {
                accessToken,
                profile
            }
            done(null, account);
        }
    )
);
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, function (jwt_payload: any, done) {
    return done(null, jwt_payload);
}));
