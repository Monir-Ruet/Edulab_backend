import Controller from "@/Interfaces/controller.interface";
import { NextFunction, Router, Request, Response } from "express";
import { Add, Fetch, Edit } from './post.validation';
import HttpStatus from "@/Lib/Exception/httpexception"
import prisma from "@/Lib/Prisma/prismaClient";
import { Prisma } from "@prisma/client";

class Post implements Controller {
    path: string;
    router: Router;
    constructor() {
        this.path = 'posts',
            this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter() {
        this.router.post('/add', Add, async (req: Request, res: Response, next: NextFunction) => {
            try {
                let { title, body, subject, tags } = req.body, titleId
                subject = subject.trim()
                title = title.trim()
                titleId = title.replace(/\s+/g, '-').toLowerCase();
                subject = subject.replace(/\s+/g, '-').toLowerCase();
                const res = await prisma.post.create({
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
                })
                next(new HttpStatus(200, 'New post added successfully'));
            }
            catch (err) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code == 'P2025') {
                        return next(new HttpStatus(400, 'Random subjects are not allowed.'))
                    } else if (err.code == 'P2002') {
                        return next(new HttpStatus(401, 'There is another post with the same title'))
                    }
                }
                else return next(new HttpStatus(500, 'Addition of a new post failed.'));
            }
        })

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
        this.router.post('/edit', Edit, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { title, body, tags } = req.body;
                const titleId = title.trim().replace(/\s+/g, '-').toLowerCase()
                const res = await prisma.post.update({
                    where: {
                        titleId: titleId
                    },
                    data: {
                        titleId: titleId,
                        title: title,
                        body: body,
                        tags: tags
                    }
                })
                return next(new HttpStatus(200, 'Post updated successfully'));
            }
            catch (err: any) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code == 'P2002') {
                        return next(new HttpStatus(401, 'There is another post with the same title'))
                    }
                }
                else return next(new HttpStatus(400, 'Something went wrong.'));
            }
        })
        this.router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const qs = req.query.keyword
                let keyword = qs as string
                if (!keyword) return res.send([])
                const result = await prisma.post.findMany({
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
                        subject:{
                          select:{
                            title:true
                          }
                        }
                    }
                })
                if (!result) return res.json([])
                else res.json(result)
            } catch (err) {
                console.log(err)
            }
        })
        this.router.delete('/delete', Fetch, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.body.titleId
                if (!id) return next(new HttpStatus(400, 'Please Provide a valid id'));
                const result = await prisma.post.delete({
                    where: {
                        titleId: id
                    }
                })
                return next(new HttpStatus(200, 'Post Deletion Successfull'))
            } catch (err) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code == 'P2025')
                        return next(new HttpStatus(400, 'There is no post with this id'))
                }
                else return next(new HttpStatus(400, 'Something went wrong'));
            }
        })


        this.router.get('/subjects', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result = await prisma.subject.findMany({
                    select: {
                        name: true,
                    }
                })
                res.send(result)
            } catch (err) {
                next(new HttpStatus(500, 'Something went wrong'))
            }
        })
        this.router.get('/:subjectId/:titleId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let subjectId = req.params.subjectId, titleId = req.params.titleId;
                if (titleId == 'default') {
                    let x = await prisma.subject.findFirst({
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
                    })
                    if (x == null) throw new Error("Subject not found");
                    else if (!x.post.length) throw new Error("There is no post on this subject");
                    titleId = x.post[0].titleId;
                }
                const result = await prisma.$transaction([
                    prisma.post.count(),
                    prisma.post.findFirst({
                        where: {
                            titleId: titleId as string
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
                ])
                if (result)
                    res.send(result);
                else throw new Error("There is no post with this id");

            } catch (err: any) {
                console.log(err)
                next(new HttpStatus(err.status | 400, err.message))
            }
        })
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
            next(new HttpStatus(400, "Not found"))
        })
    }
}

export default new Post;
