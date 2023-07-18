import Controller from "@/Interfaces/controller.interface";
import {NextFunction, Router,Request,Response} from 'express'
import { writeFileSync } from "fs";
import runCommand  from "./compiler.service";

class compiler implements Controller{
    path: string;
    router: Router;
    constructor(){
        this.path='compile';
        this.router=Router();
        this.initializeRouter();
    }
    private initializeRouter(){
        this.router.post('/',(req:Request,res:Response,next:NextFunction)=>{
            let code=req.body.code;
            const randomname=(Math.random() + 1).toString(36).substring(2);
            runCommand(`touch ${randomname}.cpp`,1000)
            .then(()=>{
                writeFileSync(`./source/${randomname}.cpp`,code);
                runCommand(`g++ -o ${randomname} ${randomname}.cpp -Wall -std=c++17 && ./${randomname}`,5000)
                .then((data)=>{
                    runCommand(`rm ${randomname}*`,1000);
                    res.send(data);
                })
                .catch((err)=>{
                    runCommand(`rm ${randomname}*`,1000);
                    if(err.killed) return res.send('TLE');
                    res.send(err.message);
                })
            })
            .catch((err)=>{
                res.send(err.message);
            })
            // runCommand(`./compile.sh '${code}'`,5000)
            // .then((data)=>{
            //     res.send(data);
            // })
            // .catch((err)=>{
            //     res.send(err.message);
            // })
        })
    }
}

export default compiler;