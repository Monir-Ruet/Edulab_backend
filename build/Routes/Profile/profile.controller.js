"use strict";
// import Controller from "@/Interfaces/controller.interface";
// import { Router,Request,Response,NextFunction } from "express";
// import user from "@/Routes/Signup/signup.model";
// import HttpException from "@/Resources/httpexception";
// import { isAuthorized } from "../Services/authentication.service";
// import profile from "./profile.interface";
// class Profile implements Controller{
//     path: string;
//     router: Router;
//     constructor(){
//         this.path='user';
//         this.router=Router();
//         this.initializeRouter();
//     }
//     private initializeRouter(){
//         this.router.get('/',[isAuthorized],async(req:Request,res:Response,next:NextFunction)=>{
//             try{
//                 var LoggedUser=<profile>await user.findOne({email:req.body.email});
//                 if(LoggedUser){
//                     const {username,fullname,email,gender}=LoggedUser;
//                     LoggedUser={fullname,username,email,gender};
//                     console.log(LoggedUser);
//                     return res.send({
//                         status:200,
//                         user:LoggedUser
//                     });
//                 }else{
//                     next(new HttpException(400,'No account found'));
//                 }
//             }
//             catch(err){
//                 next(err);
//             }
//         })
//     }
// }
// export = Profile;
