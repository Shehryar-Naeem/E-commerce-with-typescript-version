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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
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
        validator: [validator_1.default.isEmail, "Please Enter valid email,please check your email"]
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
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
    });
});
userSchema.methods.getJWTtoken = function () {
    var _a;
    const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '';
    return jwt.sign({ id: this._id }, secret, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
userSchema.methods.comparedPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
userSchema.methods.restPasswordTokenGenerate = function () {
    const resetPasswordToken = crypto_1.default.randomBytes(20).toString("hex");
    this.restpasswordtoken = crypto_1.default.createHash("sha256").update(resetPasswordToken).digest("hex");
    this.restpasswordexpire = Date.now() + 15 * 60 * 1000;
    return resetPasswordToken;
};
const User = mongoose_1.default.model("UserModel", userSchema);
exports.default = User;
