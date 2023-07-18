import { Request, Response, NextFunction } from "express";
import HttpException from "@/Lib/Exception/httpexception";

function ErrorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.json({
        status,
        message
    })
}

export default ErrorMiddleware