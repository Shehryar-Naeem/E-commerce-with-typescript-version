import mongoose from "mongoose";
mongoose.set('strictQuery', false);

export class ConnectDB{
    constructor(
        public db:any
    ){
        
    }
    dbconnect(){
        mongoose.connect(this.db).then(()=>{
            console.log("Database Connected successfully");
            
        }).catch(()=>{
            console.log("Database Not Connected");
            
        })
    }
}