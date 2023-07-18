"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
let Encrypt = (data) => {
    let hash = bcrypt_1.default.hash(data, 10);
    return hash;
};
exports.Encrypt = Encrypt;
