interface Post{
    title:string,
    body:string,
    author:string,
    tags:string[],
    createdDate:Date,
    like:number,
    dislike:number,
    count:number
}
interface IEdit{
    _id:string,
    title:string,
    body:string,
    tags:string[]
}
interface QueryPostString{
    tags?:object;
}
export {
    IEdit,
    Post,
    QueryPostString
}