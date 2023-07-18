import * as Joi from 'joi'
import validate from "../Services/validation.service";
const LoginSchema = Joi.object({
    email: Joi.string().min(5).required(),
    password: Joi.string().min(6).required()
});
export default validate(LoginSchema);