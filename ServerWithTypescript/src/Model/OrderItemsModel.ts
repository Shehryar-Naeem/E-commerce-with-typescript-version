import mongoose, { Model, Schema }  from "mongoose";
import {OrderItemModel} from "../Architecture/OrderItem"

const orderItemSchema:Schema = new mongoose.Schema({
    shippingInfo:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    postalCode:{
        type:Number,
        required:true,
        // maxlength:[11,"please enter a valid number"]
    },
    orderItem:[
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Types.ObjectId,
                ref:"Product",
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemPrice:{
        type:Number,
        default:0,
        required:true
    },
    taxPrice:{
        type:Number,
        default:0,
        required:true,
    },
    shippingPrice:{
        type:Number,
        default:0,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"processing"
    },
    deliveredAt:Date,
    createAt:{
        type:Date,
        default:Date.now
    }
})


const OrderItems:Model<OrderItemModel> = mongoose.model<OrderItemModel>("orderitems",orderItemSchema)

export default OrderItems