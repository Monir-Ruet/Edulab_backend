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
const client_1 = require("@prisma/client");
class Post {
    constructor() {
        this.path = 'posts',
            this.router = (0, express_1.Router)();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/add', post_validation_1.Add, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { title, body, subject, tags } = req.body, titleId;
                subject = subject.trim();
                title = title.trim();
                titleId = title.replace(/\s+/g, '-').toLowerCase();
                subject = subject.replace(/\s+/g, '-').toLowerCase();
                const res = yield prismaClient_1.default.post.create({
                    data: {
                        title: title,
                        titleId: titleId,
                        body: body,
                        tags: tags,
                        subject: {
                            connect: {
                                title: subject
                            }
                        }
                    }
                });
                next(new httpexception_1.default(200, 'New post added successfully'));
            }
            catch (err) {
                if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (err.code == 'P2025') {
                        return next(new httpexception_1.default(400, 'Random subjects are not allowed.'));
                    }
                    else if (err.code == 'P2002') {
                        return next(new httpexception_1.default(401, 'There is another post with the same title'));
                    }
                }
                else
                    return next(new httpexception_1.default(500, 'Addition of a new post failed.'));
            }
        }));
        // this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //         let page = parseInt(req.query.page as string), n = 10
        //         if (!page) page = 1;
        //         const result = await prisma.$transaction([
        //             prisma.post.count(),
        //             prisma.post.findMany({
        //                 take: n,
        //                 skip: (page - 1) * n,
        //                 select: {
        //                     titleId: true,
        //                     title: true,
        //                     tags: true
        //                 }
        //             })
        //         ])
        //         res.send(result);
        //     } catch (err) {
        //         return next(new HttpStatus(500, 'Something went wrong'))
        //     }
        // })
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
                if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (err.code == 'P2002') {
                        return next(new httpexception_1.default(401, 'There is another post with the same title'));
                    }
                }
                else
                    return next(new httpexception_1.default(400, 'Something went wrong.'));
            }
        }));
        this.router.get('/search', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const qs = req.query.keyword;
                let keyword = qs;
                if (!keyword)
                    return res.send([]);
                const result = yield prismaClient_1.default.post.findMany({
                    where: {
                        title: {
                            startsWith: keyword,
                            mode: 'insensitive'
                        }
                    },
                    take: 8,
                    select: {
                        title: true,
                        titleId: true,
                        subject: {
                            select: {
                                title: true
                            }
                        }
                    }
                });
                if (!result)
                    return res.json([]);
                else
                    res.json(result);
            }
            catch (err) {
                console.log(err);
            }
        }));
        this.router.delete('/delete', post_validation_1.Fetch, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.titleId;
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
                if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (err.code == 'P2025')
                        return next(new httpexception_1.default(400, 'There is no post with this id'));
                }
                else
                    return next(new httpexception_1.default(400, 'Something went wrong'));
            }
        }));
        this.router.get('/subjects', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield prismaClient_1.default.subject.findMany({
                    select: {
                        name: true,
                    }
                });
                res.send(result);
            }
            catch (err) {
                next(new httpexception_1.default(500, 'Something went wrong'));
            }
        }));
        this.router.get('/:subjectId/:titleId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let subjectId = req.params.subjectId, titleId = req.params.titleId;
                if (titleId == 'default') {
                    let x = yield prismaClient_1.default.subject.findFirst({
                        where: {
                            title: subjectId
                        },
                        select: {
                            post: {
                                orderBy: {
                                    priority: 'asc'
                                },
                                select: {
                                    titleId: true
                                }
                            }
                        }
                    });
                    if (x == null)
                        throw new Error("Subject not found");
                    else if (!x.post.length)
                        throw new Error("There is no post on this subject");
                    titleId = x.post[0].titleId;
                }
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
                            subject: {
                                select: {
                                    name: true,
                                    post: {
                                        select: {
                                            title: true,
                                            titleId: true,
                                            priority: true
                                        }
                                    }
                                }
                            }
                        }
                    })
                ]);
                if (result)
                    res.send(result);
                else
                    throw new Error("There is no post with this id");
            }
            catch (err) {
                console.log(err);
                next(new httpexception_1.default(err.status | 400, err.message));
            }
        }));
        // this.router.get('/:titleId', async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //         const titleId = req.params.titleId
        //         if (!titleId) return res.send({});
        // const result = await prisma.$transaction([
        //     prisma.post.count(),
        //     prisma.post.findFirst({
        //         where: {
        //             titleId: titleId as string
        //         },
        //         select: {
        //             title: true,
        //             body: true,
        //             tags: true,
        //             subject: {
        //                 select: {
        //                     name: true,
        //                     post: {
        //                         select: {
        //                             title: true,
        //                             titleId: true
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     })
        // ])
        //     }
        //     catch (err) {
        //         next(new HttpStatus(400, 'There is no post with this id.'));
        //     }
        // })
        this.router.all('/*', (req, res, next) => {
            next(new httpexception_1.default(400, "Not found"));
        });
    }
}
exports.default = new Post;
