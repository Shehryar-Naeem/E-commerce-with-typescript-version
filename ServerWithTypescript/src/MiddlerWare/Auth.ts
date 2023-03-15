import { AsyncErrorHandler } from "./AsyncError";
import express, { NextFunction } from "express"
import { ErrorHandler } from "../Utility/ErrorHandler";
import {UModel} from "../Architecture/User"
import User from "../Model/UserModel"
import jwt from "jsonwebtoken"

interface DecodedData {
    id: string; // Replace with the actual type of your "id" field
    // Add other properties that are included in your JWT payload
  }
export const isAuthenticatedUser=AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    
    
    const token = req.cookies.token

    if(!token){
        return next(new ErrorHandler("Please login first to access these ressource",401))
    }
 
    const secret: jwt.Secret = process.env.JWT_SECRET ?? '';
    const deCodedData = await jwt.verify(token, secret) as DecodedData; 
    

    
    (req as express.Request & {user?:UModel | null}).user= await User.findById(deCodedData.id)
    next()
})


export const AuthorizationRole = (...roles: string[]) => {
    return (req: express.Request & { user?: UModel | null }, res: express.Response, next: NextFunction) => {
        
      if (!req.user?.role || !roles.includes(req.user.role)) {
        return next(new ErrorHandler(`Role ${req.user?.role} is not allowed to access this resource`, 403));
      }
      next();
    };
  };    