"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationRole = exports.isAuthenticatedUser = void 0;
const AsyncError_1 = require("./AsyncError");
const ErrorHandler_1 = require("../Utility/ErrorHandler");
const UserModel_1 = __importDefault(require("../Model/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.isAuthenticatedUser = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorHandler_1.ErrorHandler("Please login first to access these ressource", 401));
    }
    const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '';
    const deCodedData = yield jsonwebtoken_1.default.verify(token, secret);
    req.user = yield UserModel_1.default.findById(deCodedData.id);
    next();
}));
const AuthorizationRole = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || !roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.ErrorHandler(`Role ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.AuthorizationRole = AuthorizationRole;
