"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveTokenAndCookie = void 0;
const SaveTokenAndCookie = (user, res, statusCode) => {
    const token = user.getJWTtoken();
    const options = {
        expires: new Date(Date.now() + (Number(process.env.COOKIE_EXPIRE) || 0) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};
exports.SaveTokenAndCookie = SaveTokenAndCookie;
