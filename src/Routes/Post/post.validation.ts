import Joi, { valid } from "joi";
import validate from "../Services/validation.service";

const AddSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    subject: Joi.string().required(),
    tags: Joi.array().required()
})

const FetchSchema = Joi.object({
    titleId: Joi.string().required()
})

const EditSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().required()
})

let Add = validate(AddSchema);
let Fetch = validate(FetchSchema);
let Edit = validate(EditSchema);


export {
    Add,
    Fetch,
    Edit
}
