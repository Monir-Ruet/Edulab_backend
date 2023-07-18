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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("module-alias/register");
require("dotenv/config");
const compression_1 = __importDefault(require("compression"));
const Error_middleware_1 = __importDefault(require("@/Middleware/Error.middleware"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initializeMiddleware();
        this.initializeController(controllers);
        this.initializeErrorHandling();
        this.initializeDatabase();
    }
    initializeMiddleware() {
        this.express.use(passport_1.default.initialize());
        this.express.use((0, cors_1.default)({
            origin: "http://localhost:3000",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            credentials: true // allow session cookie from browser to pass through
        }));
        this.express.use((0, cookie_parser_1.default)());
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, compression_1.default)());
    }
    initializeErrorHandling() {
        this.express.use(Error_middleware_1.default);
    }
    initializeController(controllers) {
        controllers.forEach((controller) => {
            this.express.use('/' + controller.path, controller.router);
        });
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server running on ${this.port}`);
        });
        this.express.get('/', (req, res) => {
            res.send("Hello\n");
        });
    }
}
exports.default = App;
