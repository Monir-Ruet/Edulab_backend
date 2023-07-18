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
require("module-alias/register");
const httpexception_1 = __importDefault(require("@/Lib/Exception/httpexception"));
const joi_1 = __importDefault(require("joi"));
function validationMiddleware(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const validationOptions = {
            stripUnknown: true
        };
        try {
            const value = yield schema.validateAsync(req.body, validationOptions);
            req.body = value;
            next();
        }
        catch (err) {
            if (err instanceof joi_1.default.ValidationError) {
                const error = new httpexception_1.default(400, err.details[0].message);
                next(error);
            }
        }
    });
}
exports.default = validationMiddleware;
