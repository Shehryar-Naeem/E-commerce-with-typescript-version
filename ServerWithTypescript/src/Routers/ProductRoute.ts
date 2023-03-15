import * as express from "express"
import { createAndUpdateReview, createProduct, deleteProduct, deleteReviewByAdmin, getAllProducts, getAllReviewsAboutProduct, getSingleProduct, updateProduct } from "../Controller/ProductController";
import { AuthorizationRole, isAuthenticatedUser } from "../MiddlerWare/Auth";
export class ProuductRouter{
    public router = express.Router();
    constructor(){ 
        this.intializeRoutes()
    }
    
    public intializeRoutes():void{

        
        this.router.route("/getallproducts").get(getAllProducts)
        this.router.route("/craateproduct").post(isAuthenticatedUser,AuthorizationRole("admin"),createProduct)
        this.router.route("/updateproduct/:id").put(updateProduct).delete(deleteProduct).get(getSingleProduct)
        this.router.route("/review").put(isAuthenticatedUser,createAndUpdateReview)
        this.router.route("/reviews").get(isAuthenticatedUser,AuthorizationRole("admin"),getAllReviewsAboutProduct).delete(isAuthenticatedUser,AuthorizationRole("admin"),deleteReviewByAdmin)

    }
}