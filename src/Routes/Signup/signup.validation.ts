import * as Joi from 'joi'
import validate from "../Services/validation.service";
const SingupSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(50).required(),
    email: Joi.string().email().max(40).required(),
});
export default validate(SingupSchema);