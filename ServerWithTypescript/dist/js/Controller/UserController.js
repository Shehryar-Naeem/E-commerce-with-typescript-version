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
exports.deleteUserByAdmin = exports.updateUserProfileWithRoleByAdmin = exports.getSingleUserDetailByAdmin = exports.getAllRegisterUserByAdmin = exports.updateUserProfile = exports.updateUserPassword = exports.getProfileDetailOfLogginUser = exports.restUserPassword = exports.forgetPassword = exports.logout = exports.loginUser = exports.registerUser = void 0;
const AsyncError_1 = require("../MiddlerWare/AsyncError");
const crypto_1 = __importDefault(require("crypto"));
const UserModel_1 = __importDefault(require("../Model/UserModel"));
const ErrorHandler_1 = require("../Utility/ErrorHandler");
const SaveTokenAndCookies_1 = require("../Utility/SaveTokenAndCookies");
const SendEmail_1 = __importDefault(require("../Utility/SendEmail"));
exports.registerUser = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userRegister = yield UserModel_1.default.create({
        name, email, password,
        avatar: {
            public_id: "784521285145328",
            img_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS30JTpvdB_GGY5U0TQeKZx8l1J_4yAogTV2QSNXRg3sP1FFpgrzSHRaQJq50GRV9dL7UA&usqp=CAU"
        }
    });
    // const token = userRegister.getJWTtoken()
    //     res.status(200).json({
    //         message:true,
    //         user:userRegister,
    //         token
    //     })
    (0, SaveTokenAndCookies_1.SaveTokenAndCookie)(userRegister, res, 200);
}));
exports.loginUser = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler_1.ErrorHandler("Please enter your email or password", 400));
    }
    const userLogin = yield UserModel_1.default.findOne({ email }).select("+password");
    if (!userLogin) {
        return next(new ErrorHandler_1.ErrorHandler("Invalid Email or password", 400));
    }
    const isMatchedPassword = yield userLogin.comparedPassword(password);
    if (!isMatchedPassword) {
        return next(new ErrorHandler_1.ErrorHandler("Invalid Email or password", 400));
    }
    // const token = userLogin.getJWTtoken()
    // res.status(200).json({
    //     message:true,
    //     user:userLogin,
    //     token
    // })
    (0, SaveTokenAndCookies_1.SaveTokenAndCookie)(userLogin, res, 200);
}));
exports.logout = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true
    };
    res.cookie("token", null, options);
    res.status(200).json({
        success: true,
        message: "logout succuessfully"
    });
}));
exports.forgetPassword = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email } } = req;
    const user = yield UserModel_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorHandler_1.ErrorHandler("User not found on such email", 404));
    }
    const resetPasswordToken = user.restPasswordTokenGenerate();
    yield user.save({ validateBeforeSave: false });
    const generaateUrl = `${req.protocol}://${req.get("host")}/api/user/password/reset/${resetPasswordToken}`;
    const message = `Your reset password token is :- ${generaateUrl} \n\nif you have yet requested this email then, please ignore it`;
    try {
        yield (0, SendEmail_1.default)({
            email: user.email,
            subject: "Ecommerce Recovery Password",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email send successfully to ${user.email}`
        });
        console.log(user);
    }
    catch (error) {
        user.restpasswordtoken = undefined;
        user.restpasswordexpire = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
}));
exports.restUserPassword = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // creating hash token
    const getRestPasswordToken = crypto_1.default.createHash("sha256").update(req.params.token).digest("hex");
    const user = yield UserModel_1.default.findOne({
        restpasswordtoken: getRestPasswordToken,
        restpasswordexpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandler_1.ErrorHandler("RestPasswordToken is invalid or has been Expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler_1.ErrorHandler(`confirm Password does not matched`, 400));
    }
    user.password = req.body.password;
    user.restpasswordtoken = undefined;
    user.restpasswordexpire = undefined;
    yield user.save();
    (0, SaveTokenAndCookies_1.SaveTokenAndCookie)(user, res, 200);
}));
// get Loggedin user profile detail
exports.getProfileDetailOfLogginUser = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userDetail = yield UserModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).json({
        success: true,
        userDetail
    });
}));
// update User password of loggedIn User
exports.updateUserPassword = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userpass = yield UserModel_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b.id).select("+password");
    const isMatchedPassword = yield (userpass === null || userpass === void 0 ? void 0 : userpass.comparedPassword(req.body.oldpassword));
    if (!isMatchedPassword) {
        return next(new ErrorHandler_1.ErrorHandler('old password is incorrect', 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler_1.ErrorHandler('password does not match', 400));
    }
    if (userpass !== null) {
        // your code that uses userpass goes here
        userpass.password = req.body.newPassword;
        yield userpass.save();
        (0, SaveTokenAndCookies_1.SaveTokenAndCookie)(userpass, res, 200);
    }
}));
exports.updateUserProfile = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userData = {
        name: req.body.name,
        email: req.body.email
    };
    const user = yield UserModel_1.default.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, userData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true
    });
}));
//get all User by admin
exports.getAllRegisterUserByAdmin = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllUserByAdmin = yield UserModel_1.default.find();
    const totalRegisterUser = yield UserModel_1.default.countDocuments();
    res.status(200).json({
        success: true,
        AllUsers: getAllUserByAdmin,
        totalRegisterUser
    });
}));
//get all single User by admin
exports.getSingleUserDetailByAdmin = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    const getSingleUserByAdmin = yield UserModel_1.default.findById(id);
    if (!getSingleUserByAdmin) {
        return new ErrorHandler_1.ErrorHandler("such user not found", 404);
    }
    res.status(200).json({
        success: true,
        getSingleUserByAdmin,
    });
}));
// update user profile by admin with role
exports.updateUserProfileWithRoleByAdmin = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };
    const updatedUserByAdmin = yield UserModel_1.default.findByIdAndUpdate(id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        updatedUserByAdmin
    });
}));
// delete user by admin
exports.deleteUserByAdmin = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    const user = yield UserModel_1.default.findById(id);
    if (!user) {
        return new ErrorHandler_1.ErrorHandler("such user not found", 404);
    }
    yield user.remove();
    res.status(200).json({
        success: true
    });
}));
