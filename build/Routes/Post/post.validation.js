"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edit = exports.Fetch = exports.Add = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_service_1 = __importDefault(require("../Services/validation.service"));
const AddSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    body: joi_1.default.string().required(),
    subject: joi_1.default.string().required(),
    chapter: joi_1.default.string().required(),
    tags: joi_1.default.array().required()
});
const FetchSchema = joi_1.default.object({
    titleId: joi_1.default.string().required()
});
const EditSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    body: joi_1.default.string().required(),
    tags: joi_1.default.array().required()
});
let Add = (0, validation_service_1.default)(AddSchema);
exports.Add = Add;
let Fetch = (0, validation_service_1.default)(FetchSchema);
exports.Fetch = Fetch;
let Edit = (0, validation_service_1.default)(EditSchema);
exports.Edit = Edit;
