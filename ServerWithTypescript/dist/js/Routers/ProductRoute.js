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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProuductRouter = void 0;
const express = __importStar(require("express"));
const ProductController_1 = require("../Controller/ProductController");
const Auth_1 = require("../MiddlerWare/Auth");
class ProuductRouter {
    constructor() {
        this.router = express.Router();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.route("/getallproducts").get(ProductController_1.getAllProducts);
        this.router.route("/craateproduct").post(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), ProductController_1.createProduct);
        this.router.route("/updateproduct/:id").put(ProductController_1.updateProduct).delete(ProductController_1.deleteProduct).get(ProductController_1.getSingleProduct);
        this.router.route("/review").put(Auth_1.isAuthenticatedUser, ProductController_1.createAndUpdateReview);
        this.router.route("/reviews").get(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), ProductController_1.getAllReviewsAboutProduct).delete(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), ProductController_1.deleteReviewByAdmin);
    }
}
exports.ProuductRouter = ProuductRouter;
