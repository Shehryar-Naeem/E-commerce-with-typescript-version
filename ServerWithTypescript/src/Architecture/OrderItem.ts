import mongoose from "mongoose";
export interface OrderItemModel extends mongoose.Document{
    shippingInfo:{
        address:string,
        city:string,
        state:string,
        country:string,
        postalCode: number,
        phoneNo:number
    },
    orderItem:{
        name:string,
        price:number,
        quantity:number,
        image:string,
        product:mongoose.ObjectId
    },
    paymentInfo:{
        id:string,
        status:string
    },
    paidAt:Date,
    itemsPrice:number,
    taxPrice:number,
    shippingPrice:number,
    totalPrice:number,
    orderStatus:string,
    deliveredAt:Date,
    createdAt?:Date,
}