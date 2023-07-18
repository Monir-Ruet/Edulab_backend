import bcrypt from 'bcrypt'

let Encrypt=(data:string)=>{
    let hash=bcrypt.hash(data, 10);
    return hash;
}
export {
    Encrypt
}
