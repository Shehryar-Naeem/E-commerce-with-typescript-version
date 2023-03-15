import express from "express"


type AsyncFn=(req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>;


export const AsyncErrorHandler=(AsyncFun:AsyncFn)=>{
    return (req:express.Request,res:express.Response,next:express.NextFunction):Promise<void>=>{
        return Promise.resolve(AsyncFun(req, res, next)).catch(next);
    }
}
