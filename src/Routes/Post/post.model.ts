// import mongoose, { Schema,model } from "mongoose";
// import {Post} from "./post.interface";

// const postSchema=new Schema<Post>({
//     title:{
//         type:String,
//         required:true
//     },
//     body:{
//         type:String,
//         required:true
//     },
//     author:{
//         type:String,
//         required:true
//     },
//     tags:{
//         type:[String]
//     },
//     createdDate:{
//         type:Date,
//         default:Date.now()
//     },
//     like:{
//         type:Number,
//         default:0
//     },
//     dislike:{
//         type:Number,
//         default:0
//     },
//     count:{
//         type:Number,
//         default:0
//     }
// });
// const post=model<Post>('Post',postSchema);
// export default post;