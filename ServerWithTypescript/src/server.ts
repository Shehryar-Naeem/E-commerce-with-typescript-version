import App from "./app"
import * as dotenv from "dotenv"
import { ConnectDB } from "./DBConfig/db"
dotenv.config({path:"./ServerWithTypescript/config.env"})


const PORT = process.env.PORT
const db = process.env.DB


const dbConnect = new ConnectDB(db)
dbConnect.dbconnect()
App.listen(PORT,()=>{
    console.log(`Server is created successfully at port ${PORT}`);
})