import 'module-alias/register'
import HttpException from "@/Lib/Exception/httpexception";
import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validationOptions = {
            stripUnknown: true
        }
        try {
            const value = await schema.validateAsync(req.body, validationOptions);
            req.body = value;
            next();
        }
        catch (err) {
            if (err instanceof Joi.ValidationError) {
                const error: HttpException = new HttpException(400, err.details[0].message);
                next(error);
            }
        }
    }
}
export default validationMiddleware;
