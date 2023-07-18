import * as jwt from "jsonwebtoken";
import passport from "passport";

class JWTHandler {
    public GenerateJWTtoken(payload: any): string {
        const secretKey: string = process.env.JWT_SECRET!;
        return jwt.sign(payload, secretKey, { expiresIn: '2592000s' });
    }
    public isAuthorized = passport.authenticate('jwt', { session: false });
}
export default new JWTHandler();

