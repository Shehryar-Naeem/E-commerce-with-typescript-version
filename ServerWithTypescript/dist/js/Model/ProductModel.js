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
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"]
    },
    discription: {
        type: String,
        required: true
    },
    price: {
        type: String,
        requried: [true, "Please Enter the price of product"],
        maxlength: [8, "Please not exceed 8 character"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            img_url: {
                type: String,
                required: true,
                default: "https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1110/cms/4O4cOXrGLvTEI4P7nU24qI/5e4ef885b61b17068fdd7d5b5f6388c0/AA003MM_SHOE_LEFT_GLOBAL_MENS_TREE_DASHER2_HAZY_INDIGO_BLIZZARD_.png"
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter the product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter the product stock"],
        maxlength: [4, "Please not exceed 4 digits"],
        default: 1
    },
    noOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "user",
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
                default: 0
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});
const Products = mongoose_1.default.model("ProductModel", ProductSchema);
exports.default = Products;
