"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    shippingInfo: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: Number,
        required: true,
        // maxlength:[11,"please enter a valid number"]
    },
    orderItem: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true,
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        default: "processing"
    },
    deliveredAt: Date,
    createAt: {
        type: Date,
        default: Date.now
    }
});
const OrderItems = mongoose_1.default.model("orderitems", orderItemSchema);
exports.default = OrderItems;
