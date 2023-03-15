import mongoose, { Model, Schema } from "mongoose";
import {PModel} from "../Architecture/Product"
const ProductSchema: mongoose.Schema = new Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name"]
    },
    discription:{
        type:String,
        required:true
    },
    price:{
        type:String,
        requried:[true,"Please Enter the price of product"],
        maxlength:[8,"Please not exceed 8 character"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            img_url:{
                type:String,
                required:true,
                default:"https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1110/cms/4O4cOXrGLvTEI4P7nU24qI/5e4ef885b61b17068fdd7d5b5f6388c0/AA003MM_SHOE_LEFT_GLOBAL_MENS_TREE_DASHER2_HAZY_INDIGO_BLIZZARD_.png"
            }
        }
    ]  ,
    category:{
        type:String,
        required:[true,"Please Enter the product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter the product stock"],
        maxlength:[4,"Please not exceed 4 digits"],
        default:1
    },
    noOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "user",
                required: true,
              },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
                default:0
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
      },
    createdAt:{
        type:Date,
        default:Date.now,
    }
},{
    timestamps:true
})

const Products: Model<PModel> = mongoose.model<PModel>("ProductModel",ProductSchema)

export default Products