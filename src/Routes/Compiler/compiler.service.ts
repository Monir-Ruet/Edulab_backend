import { exec } from "child_process";


function runCommand(command:string,timeOut:number){
    command='cd source && '+command;
    return new Promise((resolve,reject)=>{
        exec(command,{maxBuffer: 100000000,timeout:timeOut}, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        });
    })
}
function a(){

}
export default runCommand;