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
const express_1 = require("express");
const post_validation_1 = require("./post.validation");
const httpexception_1 = __importDefault(require("@/Lib/Exception/httpexception"));
const prismaClient_1 = __importDefault(require("@/Lib/Prisma/prismaClient"));
const bson_1 = require("bson");
class Post {
    constructor() {
        this.path = 'posts',
            this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/add', post_validation_1.Add, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { title, body, subject, chapter, tags } = req.body, titleId;
                subject = subject.trim();
                chapter = chapter.trim();
                title = title.trim();
                titleId = title.replace(/\s+/g, '-').toLowerCase();
                const subjectId = yield prismaClient_1.default.subject.findFirst({
                    where: {
                        name: subject
                    },
                    select: {
                        id: true
                    }
                });
                let SubjectId;
                if (!(subjectId === null || subjectId === void 0 ? void 0 : subjectId.id))
                    SubjectId = new bson_1.ObjectId().toString();
                else
                    SubjectId = subjectId.id;
                const res = yield prismaClient_1.default.post.create({
                    data: {
                        title: title,
                        titleId: titleId,
                        body: body,
                        tags: tags,
                        chapter: {
                            connectOrCreate: {
                                where: {
                                    subjectId_name: {
                                        name: chapter,
                                        subjectId: SubjectId
                                    }
                                }, create: {
                                    name: chapter,
                                    subject: {
                                        connectOrCreate: {
                                            where: {
                                                name: subject
                                            },
                                            create: {
                                                name: subject
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                next(new httpexception_1.default(200, 'New post added successfully'));
            }
            catch (err) {
                console.log(err);
                next(new httpexception_1.default(400, 'Addition of a new post failed.'));
            }
        }));
        this.router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let page = parseInt(req.query.page), n = 10;
                if (!page)
                    page = 1;
                const result = yield prismaClient_1.default.$transaction([
                    prismaClient_1.default.post.count(),
                    prismaClient_1.default.post.findMany({
                        take: n,
                        skip: (page - 1) * n,
                        select: {
                            titleId: true,
                            title: true,
                            tags: true
                        }
                    })
                ]);
                res.send(result);
            }
            catch (err) {
                return next(new httpexception_1.default(500, 'Something went wrong'));
            }
        }));
        this.router.post('/edit', post_validation_1.Edit, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, body, tags } = req.body;
                const titleId = title.trim().replace(/\s+/g, '-').toLowerCase();
                const res = yield prismaClient_1.default.post.update({
                    where: {
                        titleId: titleId
                    },
                    data: {
                        titleId: titleId,
                        title: title,
                        body: body,
                        tags: tags
                    }
                });
                return next(new httpexception_1.default(200, 'Post updated successfully'));
            }
            catch (err) {
                next(err);
            }
        }));
        this.router.delete('/delete', post_validation_1.Fetch, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.titleId;
                console.log(req.body);
                if (!id)
                    return next(new httpexception_1.default(400, 'Please Provide a valid id'));
                const result = yield prismaClient_1.default.post.delete({
                    where: {
                        titleId: id
                    }
                });
                return next(new httpexception_1.default(200, 'Post Deletion Successfull'));
            }
            catch (err) {
                next(new httpexception_1.default(400, 'There is no post with this id.'));
            }
        }));
        this.router.get('/:titleId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const titleId = req.params.titleId;
                if (!titleId)
                    return res.send({});
                const result = yield prismaClient_1.default.$transaction([
                    prismaClient_1.default.post.count(),
                    prismaClient_1.default.post.findFirst({
                        where: {
                            titleId: titleId
                        },
                        select: {
                            title: true,
                            body: true,
                            tags: true,
                            chapter: {
                                select: {
                                    name: true,
                                    subject: {
                                        select: {
                                            name: true,
                                            chapter: {
                                                select: {
                                                    name: true,
                                                    priority: true,
                                                    post: {
                                                        select: {
                                                            title: true,
                                                            titleId: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                ]);
                res.send(result);
            }
            catch (err) {
                next(new httpexception_1.default(400, 'There is no post with this id.'));
            }
        }));
    }
}
exports.default = new Post;
