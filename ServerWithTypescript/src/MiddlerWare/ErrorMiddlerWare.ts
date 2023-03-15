import { ErrorHandler } from "../Utility/ErrorHandler";
import express, { NextFunction } from "express"

export const errorMiddlerWare:express.ErrorRequestHandler=(err:ErrorHandler,req:express.Request,res:express.Response,next:NextFunction):void=>{
    err.message= err.message || "internal server error"
    err.statusCode=err.statusCode || 500


    
    res.status(err.statusCode).json({
        success:false,
        error:err.message   
    })
}