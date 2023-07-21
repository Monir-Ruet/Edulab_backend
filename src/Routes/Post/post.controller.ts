import Controller from "@/Interfaces/controller.interface";
import { NextFunction, Router, Request, Response } from "express";
import { Add, Fetch, Edit } from './post.validation';
import HttpStatus from "@/Lib/Exception/httpexception"
import prisma from "@/Lib/Prisma/prismaClient";
import { ObjectId } from 'bson'

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
                let { title, body, subject, chapter, tags } = req.body, titleId
                subject = subject.trim()
                chapter = chapter.trim()
                title = title.trim()
                titleId = title.replace(/\s+/g, '-').toLowerCase();
                const subjectId = await prisma.subject.findFirst({
                    where: {
                        name: subject
                    },
                    select: {
                        id: true
                    }
                })
                let SubjectId;
                if (!subjectId?.id) SubjectId = new ObjectId().toString()
                else SubjectId = subjectId.id
                const res = await prisma.post.create({
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
                })
                next(new HttpStatus(200, 'New post added successfully'));
            }
            catch (err) {
                console.log(err)
                next(new HttpStatus(400, 'Addition of a new post failed.'));
            }
        })

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let page = parseInt(req.query.page as string), n = 10
                if (!page) page = 1;
                const result = await prisma.$transaction([
                    prisma.post.count(),
                    prisma.post.findMany({
                        take: n,
                        skip: (page - 1) * n,
                        select: {
                            titleId: true,
                            title: true,
                            tags: true
                        }
                    })
                ])
                res.send(result);
            } catch (err) {
                return next(new HttpStatus(500, 'Something went wrong'))
            }

        })
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
            catch (err) {
                next(err);
            }
        })

        this.router.delete('/delete', Fetch, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.body.titleId
                console.log(req.body)
                if (!id) return next(new HttpStatus(400, 'Please Provide a valid id'));
                const result = await prisma.post.delete({
                    where: {
                        titleId: id
                    }
                })
                return next(new HttpStatus(200, 'Post Deletion Successfull'))
            } catch (err) {
                next(new HttpStatus(400, 'There is no post with this id.'));
            }
        })

        this.router.get('/:titleId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const titleId = req.params.titleId
                if (!titleId) return res.send({});
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
                                                    post:{
                                                        select:{
                                                            title:true,
                                                            titleId:true
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
                ])
                res.send(result);
            }
            catch (err) {
                next(new HttpStatus(400, 'There is no post with this id.'));
            }
        })
    }
}

export default new Post;
