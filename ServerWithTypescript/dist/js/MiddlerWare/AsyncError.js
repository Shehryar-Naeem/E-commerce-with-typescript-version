"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncErrorHandler = void 0;
const AsyncErrorHandler = (AsyncFun) => {
    return (req, res, next) => {
        return Promise.resolve(AsyncFun(req, res, next)).catch(next);
    };
};
exports.AsyncErrorHandler = AsyncErrorHandler;
