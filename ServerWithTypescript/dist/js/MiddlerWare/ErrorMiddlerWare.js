"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddlerWare = void 0;
const errorMiddlerWare = (err, req, res, next) => {
    err.message = err.message || "internal server error";
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        success: false,
        error: err.message
    });
};
exports.errorMiddlerWare = errorMiddlerWare;
