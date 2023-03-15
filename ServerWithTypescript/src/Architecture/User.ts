import mongoose from "mongoose"


export interface UModel extends mongoose.Document{
    name:string,
    email:string,
    password:string,
    avatar:{
        public_id:string,
        img_url:string
    },
    role:string,
    createdAt:Date,
    restpasswordtoken:string | undefined,
    restpasswordexpire:string | undefined,
    getJWTtoken: () => string;
    comparedPassword:(password:string)=> Promise<boolean>
    restPasswordTokenGenerate:()=>string
}