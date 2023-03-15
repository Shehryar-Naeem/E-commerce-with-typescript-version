import { UModel } from "../Architecture/User"
import express from "express"
import mongoose, { model, Model, Schema } from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import crypto from "crypto"


const userSchema: Schema = new mongoose.Schema<UModel>({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxlength: [30, "Your name is too big, Your name should be 30 character"],
        minilength: [3, "Your name is too short, Your should be above 3 character"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minlength: [8, "our password should be greator than 8 characer"],
        select: false // this line mean when simple user enter his password and when admin check this user specification admin will not be able to access this simpler user password
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: true,
        validator: [validator.isEmail, "Please Enter valid email,please check your email"]
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        img_url: {
            type: String,
            required: true,
            default: "https://p.kindpng.com/picc/s/24-248253_user-profile-default-image-png-clipart-png-download.png"
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    restpasswordtoken: String,
    restpasswordexpire: String
})

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }
    
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJWTtoken = function () {
    const secret: jwt.Secret = process.env.JWT_SECRET ?? '';
    return jwt.sign({ id: this._id }, secret, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparedPassword=async function(password:string):Promise<Boolean>{
    return await bcrypt.compare(password,this.password)
}



userSchema.methods.restPasswordTokenGenerate= function(){
    const resetPasswordToken:string = crypto.randomBytes(20).toString("hex")
    this.restpasswordtoken= crypto.createHash("sha256").update(resetPasswordToken).digest("hex")

    this.restpasswordexpire= Date.now() + 15 * 60 * 1000;
    return resetPasswordToken;
    
}



const User: Model<UModel> = mongoose.model<UModel>("UserModel", userSchema)

export default User