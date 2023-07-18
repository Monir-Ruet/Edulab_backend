"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const compiler_service_1 = __importDefault(require("./compiler.service"));
class compiler {
    constructor() {
        this.path = 'compile';
        this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/', (req, res, next) => {
            let code = req.body.code;
            const randomname = (Math.random() + 1).toString(36).substring(2);
            (0, compiler_service_1.default)(`touch ${randomname}.cpp`, 1000)
                .then(() => {
                (0, fs_1.writeFileSync)(`./source/${randomname}.cpp`, code);
                (0, compiler_service_1.default)(`g++ -o ${randomname} ${randomname}.cpp -Wall -std=c++17 && ./${randomname}`, 5000)
                    .then((data) => {
                    (0, compiler_service_1.default)(`rm ${randomname}*`, 1000);
                    res.send(data);
                })
                    .catch((err) => {
                    (0, compiler_service_1.default)(`rm ${randomname}*`, 1000);
                    if (err.killed)
                        return res.send('TLE');
                    res.send(err.message);
                });
            })
                .catch((err) => {
                res.send(err.message);
            });
            // runCommand(`./compile.sh '${code}'`,5000)
            // .then((data)=>{
            //     res.send(data);
            // })
            // .catch((err)=>{
            //     res.send(err.message);
            // })
        });
    }
}
exports.default = compiler;
