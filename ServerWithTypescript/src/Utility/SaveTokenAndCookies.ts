import { UModel } from "../Architecture/User"
import express from "express"

export const SaveTokenAndCookie = (user: UModel, res: express.Response, statusCode: number) => {

    const token = user.getJWTtoken()

    const options = {
        expires: new Date(Date.now() + (Number(process.env.COOKIE_EXPIRE) || 0) * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    })
}




