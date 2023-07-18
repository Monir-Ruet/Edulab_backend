// import Controller from "@/Interfaces/controller.interface";
// import { NextFunction, Router,Request,Response } from "express";
// import {Add,Fetch,Edit} from './post.validation';
// import post from "./post.model";
// import HttpException from "@/Resources/httpexception";
// import { IEdit,QueryPostString } from "./post.interface";

// class Post implements Controller{
//     path: string;
//     router: Router;
//     constructor(){
//         this.path='posts',
//         this.router=Router();
//         this.initializeRouter();
//     }
//     private initializeRouter(){
//         this.router.post('/add',Add,async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 const newPost=new post(req.body);
//                 await newPost.save();
//                 next(new HttpException(200,'New post added successfully'));
//             }
//             catch(err){
//                 next(new HttpException(400,'Unable to add new Item'));
//             }
//         })
//         this.router.post('/edit',Edit,async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 let data=<IEdit>req.body;
//                 let toEdit=await post.updateOne({_id:data._id},req.body);
//                 if(toEdit) return next(new HttpException(200,'Information updated successfully.'));
//                 else return next(new HttpException(400,'There is no post with this id.'));
//             }
//             catch(err){
//                 next(err);
//             }
//         })

//         this.router.delete('/delete',Fetch,async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 let f=await post.deleteOne(req.body);
//                 if(f.deletedCount) return next(new HttpException(200,'Post deleted successfully'));
//                 else throw new Error();
//             }catch(err){
//                 next(new HttpException(400,'There is no post with this id.'));
//             }
//         })
//         this.router.post('/like',Fetch,async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 let f=await post.updateOne(req.body,{$inc:{like:1}});
//                 if(f.modifiedCount) next(new HttpException(200,'Liked'));
//                 else throw new Error();
//             }catch(err){
//                 next(new HttpException(400,'There is no post with this id.'));
//             }
//         })
//         this.router.post('/dislike',Fetch,async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 let f=await post.updateOne(req.body,{$inc:{dislike:1}});
//                 if(f.modifiedCount) next(new HttpException(200,'Disliked'));
//                 else throw new Error();
//             }catch(err){
//                 next(new HttpException(400,'There is no post with this id.'));
//             }
//         })
        
//         this.router.post('/view',Fetch,async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 let result=await post.findOne(req.body);
//                 if(result) {
//                     await post.updateOne(req.body,{$inc:{count:+1}});
//                     result.count++;
//                     return res.send(result);
//                 }
//                 else throw new Error();
//             }
//             catch(err){
//                 next(new HttpException(400,'There is no post with this id.'));
//             }
//         })
//         // Specific Post
//         this.router.get('/',async(req:Request,res:Response,next:NextFunction)=>{
//             req.query.id=<string>req.query.id;
//             if(req.query.id==undefined) return next();
//             try{
//                 let result=await post.findOne({_id:req.query.id});
//                 if(result) {
//                     await post.updateOne({_id:req.query.id},{$inc:{count:+1}});
//                     result.count++;
//                     return res.send(result);
//                 }
//                 else throw new Error();
//             }catch(err){
//                 next(new HttpException(400,'Error Page'));
//             }
//         })
//         //Dashboard all post 
//         this.router.get('/',async(req:Request,res:Response,next:NextFunction)=>{
//           try{
//             let page:number=1,tags:string[]=[];
//             req.query.tags=<string>req.query.tags;
//             req.query.page=<string>req.query.page;

//             // Split tags
//             if(req.query.tags!=undefined)
//                 tags=req.query.tags.split(',');

//             // Page number
//             if(req.query.page!=undefined)
//                 page=parseInt(<string>req.query.page);
//             if(page===NaN) page=1;
            
//             //MongoQuery
//             let MongoQuery:QueryPostString={};
//             if(tags.length!=0) MongoQuery.tags={$all:tags};

//             let data=await post.find(MongoQuery).skip(10*(page-1)).limit(10).sort({ 'createdDate': -1 });
//             res.send(data);
//           }catch(err){
//             next(new HttpException(400,'Error Fetching data'));
//           }
//         })
//     }
// }

// export default Post;
