"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const ProductRoute_1 = require("./Routers/ProductRoute");
const ErrorMiddlerWare_1 = require("./MiddlerWare/ErrorMiddlerWare");
const UserRoute_1 = __importDefault(require("./Routers/UserRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.middleWare();
        this.prodRoute = new ProductRoute_1.ProuductRouter();
        this.userRoute = new UserRoute_1.default();
        this.initializeRouter();
    }
    middleWare() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(ErrorMiddlerWare_1.errorMiddlerWare);
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRouter() {
        this.app.use("/api/products", this.prodRoute.router);
        this.app.use("/api/user", this.userRoute.router);
    }
}
exports.default = new App().app;
