import express, { Application } from "express";
import * as bodyParser from "body-parser"
import { ProuductRouter } from "./Routers/ProductRoute";
import { errorMiddlerWare } from "./MiddlerWare/ErrorMiddlerWare";
import UserRoute from "./Routers/UserRoute";
import cookieParser from "cookie-parser";

class App{
    public app:Application;
    public prodRoute:ProuductRouter;
    public userRoute:UserRoute;
    constructor(){
        this.app=express()
        this.middleWare();
        this.prodRoute= new ProuductRouter()
        this.userRoute= new UserRoute()
        this.initializeRouter();
    }
    private middleWare():void{
        
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended:false}))
        this.app.use(errorMiddlerWare)
        this.app.use(cookieParser())
    }
    private initializeRouter():void{
        this.app.use("/api/products",this.prodRoute.router)
        this.app.use("/api/user",this.userRoute.router)
    }
}

export default new App().app