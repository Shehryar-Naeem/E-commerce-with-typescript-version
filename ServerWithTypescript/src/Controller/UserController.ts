import { AsyncErrorHandler } from "../MiddlerWare/AsyncError";
import express from "express"
import crypto from "crypto"
import User from "../Model/UserModel";
import { ErrorHandler } from "../Utility/ErrorHandler";
import { SaveTokenAndCookie } from "../Utility/SaveTokenAndCookies";
import sendEamil from "../Utility/SendEmail"
import { UModel } from "../Architecture/User";



export const registerUser=AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const {name,email,password}=req.body

    const userRegister = await User.create({
        name,email,password,
        avatar:{
            public_id:"784521285145328",
            img_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS30JTpvdB_GGY5U0TQeKZx8l1J_4yAogTV2QSNXRg3sP1FFpgrzSHRaQJq50GRV9dL7UA&usqp=CAU"
        }
    })
// const token = userRegister.getJWTtoken()
    
//     res.status(200).json({
//         message:true,
//         user:userRegister,
//         token
//     })
    SaveTokenAndCookie(userRegister,res,200)
})


export const loginUser=AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const {email,password}= req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter your email or password",400))
    }
    const userLogin = await User.findOne({email}).select("+password")
    if(!userLogin){
        return next(new ErrorHandler("Invalid Email or password",400))
    }

    const isMatchedPassword = await userLogin.comparedPassword(password)

    if(!isMatchedPassword){
        return next(new ErrorHandler("Invalid Email or password",400))
    }
    // const token = userLogin.getJWTtoken()
    
    // res.status(200).json({
    //     message:true,
    //     user:userLogin,
    //     token
    // })


    SaveTokenAndCookie(userLogin,res,200)
})

export const logout =AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const options={
        expires: new Date(Date.now()),
        httpOnly:true
    }
    res.cookie("token",null,options)
    res.status(200).json({
        success:true,
        message:"logout succuessfully"
    })
})



export const forgetPassword= AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const {body:{email}}=req
    const user = await User.findOne({email})
    if(!user){
        return next(new ErrorHandler("User not found on such email",404))
    }
    
    const resetPasswordToken = user.restPasswordTokenGenerate()
    
    
    
    await user.save({validateBeforeSave:false})
    
    
    
    const generaateUrl= `${req.protocol}://${req.get("host")}/api/user/password/reset/${resetPasswordToken}`;
    
    const message= `Your reset password token is :- ${generaateUrl} \n\nif you have yet requested this email then, please ignore it`;
    try{
        await sendEamil({
            email:user.email,
            subject:"Ecommerce Recovery Password",
            message
        })
        res.status(200).json({
            success:true,
            message:`Email send successfully to ${user.email}`
        })
        console.log(user);
    }catch(error:any){
        user.restpasswordtoken = undefined;
        user.restpasswordexpire = undefined;

        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message, 500))


        
     }
})



export const restUserPassword = AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{

    // creating hash token
    
    const getRestPasswordToken= crypto.createHash("sha256").update(req.params.token).digest("hex")
    
    
    const user= await User.findOne({
        restpasswordtoken: getRestPasswordToken,
        restpasswordexpire:{$gt:Date.now()}
    })
    
    if(!user){
        return next(new ErrorHandler("RestPasswordToken is invalid or has been Expired",400))
    }

    if(req.body.password!== req.body.confirmPassword){
        return next(new ErrorHandler(`confirm Password does not matched`,400))
    }


    user.password= req.body.password
    user.restpasswordtoken = undefined;
    user.restpasswordexpire = undefined;

    await user.save()
    SaveTokenAndCookie(user,res,200)
    
})


// get Loggedin user profile detail
export const getProfileDetailOfLogginUser= AsyncErrorHandler(async  (req:express.Request& { user?: UModel | null },res:express.Response,next:express.NextFunction)=>{
    const userDetail = await User.findById(req.user?.id)

    res.status(200).json({
        success:true,
        userDetail
    })
})


// update User password of loggedIn User


export const updateUserPassword=AsyncErrorHandler(async  (req:express.Request& { user?: UModel | null },res:express.Response,next:express.NextFunction)=>{
    const userpass= await User.findById(req.user?.id).select("+password")
    

    const isMatchedPassword= await userpass?.comparedPassword(req.body.oldpassword)

    if(!isMatchedPassword){
        return next(new ErrorHandler('old password is incorrect', 400))
    }
    if(req.body.newPassword!== req.body.confirmPassword){
        return  next(new ErrorHandler('password does not match', 400))
    }
    if (userpass !== null) {
        // your code that uses userpass goes here
        userpass.password= req.body.newPassword
        await userpass.save()
        SaveTokenAndCookie(userpass,res,200)

      }


})



export const updateUserProfile=AsyncErrorHandler(async (req:express.Request& { user?: UModel | null },res:express.Response,next:express.NextFunction)=>{
    const userData={
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user?.id,userData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })

})

//get all User by admin
export const getAllRegisterUserByAdmin=AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const getAllUserByAdmin = await User.find()
    const totalRegisterUser = await User.countDocuments();
    res.status(200).json({
        success:true,
        AllUsers:getAllUserByAdmin,
        totalRegisterUser
    })
})

//get all single User by admin
export const getSingleUserDetailByAdmin=AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const {params:{id}}=req
    const getSingleUserByAdmin = await User.findById(id)

    if(!getSingleUserByAdmin){
        return new ErrorHandler("such user not found",404)
    }
    res.status(200).json({
        success:true,
        getSingleUserByAdmin,
    })
})



// update user profile by admin with role
export const updateUserProfileWithRoleByAdmin=AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const {params:{id}}=req

    const newData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const updatedUserByAdmin= await User.findByIdAndUpdate(id,newData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        updatedUserByAdmin
    })
})



// delete user by admin

export const deleteUserByAdmin = AsyncErrorHandler(async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const {params:{id}}=req
    const user = await User.findById(id)

    if(!user){
        return new ErrorHandler("such user not found",404)
    }
    await user.remove()

    res.status(200).json({
        success:true
    })
})