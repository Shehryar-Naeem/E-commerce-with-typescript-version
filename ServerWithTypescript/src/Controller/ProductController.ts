import express from "express";
import { AsyncErrorHandler } from "../MiddlerWare/AsyncError";
import Products from "../Model/ProductModel";
import { ErrorHandler } from "../Utility/ErrorHandler";
import { PModel } from "../Architecture/Product";
import { ApiFeature } from "../Utility/ApiFeatures";
import { UModel } from "../Architecture/User";
interface QueryString {
    keyword?: string;
    category?: string;
    price?: string;
    [key: string]: string | undefined;
}
export const getAllProducts =AsyncErrorHandler( async (req: express.Request, res: express.Response,next:express.NextFunction) => {

    const resultPerPage:number = 6;
    const coutProduct = await Products.countDocuments()
    const apifeature = new ApiFeature(Products.find(),req.query as QueryString).search().filter().pagination(resultPerPage)
    const getAllProducts = await apifeature.query
    res.status(200).json({
        success:true,
        getAllProducts:getAllProducts,
        countProduct:coutProduct
    })
})


export const createProduct= AsyncErrorHandler(async (req: express.Request & { user?: UModel | null }, res:express.Response,next:express.NextFunction)=>{
    const {body}=req
    
    req.body.user= req.user?.id;
    const createAProduct = await Products.create(body)
    res.status(200).json({
        success:true,
        createAProduct:createAProduct,
        message:"Product created successfully"

    })
})



export const updateProduct= AsyncErrorHandler(async (req:express.Request,res:express.Response, next:express.NextFunction)=>{
    const {params:{id},body}=req
    let updateProduct = await Products.findById(id)
    if(!updateProduct){
        return next(new ErrorHandler("product not found on such id",404))
    }
    updateProduct= await Products.findByIdAndUpdate(id,body)

    res.status(201).json({
        success:true,
        updateProduct:updateProduct,
        message:"Product updated successfully"
    })
})

export const deleteProduct= AsyncErrorHandler(async (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    const {params:{id}}=req
    const productDeleted= await Products.findById(id)

    if(!productDeleted){
        return next(new ErrorHandler("product not found on such id",404))
    }
    productDeleted.remove()

    res.status(200).json({
        success:true,
        message:"Prouct deleted successfully",
        deleteProduct:productDeleted
    })

})


export const getSingleProduct= AsyncErrorHandler(async (req:express.Request,res:express.Response,next: express.NextFunction)=>{
    const {params:{id}}=req;
    const getASingleProduct= await Products.findById(id)
    if(!getASingleProduct){
        return next(new ErrorHandler("product not found on such id",404))
    }
    res.status(200).json({
        success:true,
        singleProduct:getASingleProduct
    })
})




//create and upadate a review about product

export const createAndUpdateReview=AsyncErrorHandler(async(req: express.Request & { user?: UModel | null }, res:express.Response,next:express.NextFunction)=>{
    const {rating,comment,productId}= req.body

    const reviewData={
        user: req.user?._id,
        name: req.user!.name,
        rating:Number(rating),
        comment
    }

    const product= await Products.findById(productId)
    const isReviewed= product?.reviews.find(rev=>rev.user.toString()===req.user?._id.toString())
    if(isReviewed){
        product?.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user?._id.toString()){
                rev.comment=comment
                rev.rating=rating
            }
        })
    }else{
        product?.reviews.push(reviewData)
        if(product!==null){

            product.noOfReviews= product?.reviews.length
        }
    }

    let avg=0;

    product?.reviews.forEach(rev=>{
        avg+= rev.rating
    })
    if(product!==null){

        product!.ratings= avg / product?.reviews.length
    }
    
    await product?.save({validateBeforeSave:false})
    res.status(200).json({
      success:true
    })

})

// get all reviews by admin

export const getAllReviewsAboutProduct=AsyncErrorHandler(async (req:express.Request,res:express.Response, next:express.NextFunction)=>{
    const product= await Products.findById(req.query.id)


    if(!product){
        return next(new ErrorHandler(`product not find`,404))
    }

    res.status(200).json({
        message:true,
        reviews:product.reviews
      })
})


// delete reviews by admin

export const deleteReviewByAdmin=AsyncErrorHandler(async (req:express.Request,res:express.Response, next:express.NextFunction)=>{
    const product = await Products.findById(req.query.productId)    
    if(!product){
        return next(new ErrorHandler(`product not find`,404))
    }

    const reviews = product.reviews.filter(rev => {
        if (rev._id) {
            return rev._id.toString() !== (req.query.id?.toString() || '');
        }
        return false;
    });
    let avg=0;

    reviews.forEach((rev)=>{
        avg+=rev.rating
    })

    let rating =0;
    if(reviews.length===0){
        rating =0
    }else{
        rating = avg / reviews.length
    }
    const noOfReviews= reviews.length

    await Products.findByIdAndUpdate(req.query.productId,{
        reviews,
        rating,
        noOfReviews
      },
      {
        new:true,
        runValidators:true,
        useFindAndModify:false
      })
    
      res.status(200).json({
        message:true,
        // reviews,
        // ratings,
        // noOfReviews
    
      })

})