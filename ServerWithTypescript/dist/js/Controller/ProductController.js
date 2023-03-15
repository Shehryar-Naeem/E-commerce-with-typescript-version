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
exports.deleteReviewByAdmin = exports.getAllReviewsAboutProduct = exports.createAndUpdateReview = exports.getSingleProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getAllProducts = void 0;
const AsyncError_1 = require("../MiddlerWare/AsyncError");
const ProductModel_1 = __importDefault(require("../Model/ProductModel"));
const ErrorHandler_1 = require("../Utility/ErrorHandler");
const ApiFeatures_1 = require("../Utility/ApiFeatures");
exports.getAllProducts = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const resultPerPage = 6;
    const coutProduct = yield ProductModel_1.default.countDocuments();
    const apifeature = new ApiFeatures_1.ApiFeature(ProductModel_1.default.find(), req.query).search().filter().pagination(resultPerPage);
    const getAllProducts = yield apifeature.query;
    res.status(200).json({
        success: true,
        getAllProducts: getAllProducts,
        countProduct: coutProduct
    });
}));
exports.createProduct = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { body } = req;
    req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const createAProduct = yield ProductModel_1.default.create(body);
    res.status(200).json({
        success: true,
        createAProduct: createAProduct,
        message: "Product created successfully"
    });
}));
exports.updateProduct = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, body } = req;
    let updateProduct = yield ProductModel_1.default.findById(id);
    if (!updateProduct) {
        return next(new ErrorHandler_1.ErrorHandler("product not found on such id", 404));
    }
    updateProduct = yield ProductModel_1.default.findByIdAndUpdate(id, body);
    res.status(201).json({
        success: true,
        updateProduct: updateProduct,
        message: "Product updated successfully"
    });
}));
exports.deleteProduct = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    const productDeleted = yield ProductModel_1.default.findById(id);
    if (!productDeleted) {
        return next(new ErrorHandler_1.ErrorHandler("product not found on such id", 404));
    }
    productDeleted.remove();
    res.status(200).json({
        success: true,
        message: "Prouct deleted successfully",
        deleteProduct: productDeleted
    });
}));
exports.getSingleProduct = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    const getASingleProduct = yield ProductModel_1.default.findById(id);
    if (!getASingleProduct) {
        return next(new ErrorHandler_1.ErrorHandler("product not found on such id", 404));
    }
    res.status(200).json({
        success: true,
        singleProduct: getASingleProduct
    });
}));
//create and upadate a review about product
exports.createAndUpdateReview = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { rating, comment, productId } = req.body;
    const reviewData = {
        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    const product = yield ProductModel_1.default.findById(productId);
    const isReviewed = product === null || product === void 0 ? void 0 : product.reviews.find(rev => { var _a; return rev.user.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()); });
    if (isReviewed) {
        product === null || product === void 0 ? void 0 : product.reviews.forEach(rev => {
            var _a;
            if (rev.user.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                rev.comment = comment;
                rev.rating = rating;
            }
        });
    }
    else {
        product === null || product === void 0 ? void 0 : product.reviews.push(reviewData);
        if (product !== null) {
            product.noOfReviews = product === null || product === void 0 ? void 0 : product.reviews.length;
        }
    }
    let avg = 0;
    product === null || product === void 0 ? void 0 : product.reviews.forEach(rev => {
        avg += rev.rating;
    });
    if (product !== null) {
        product.ratings = avg / (product === null || product === void 0 ? void 0 : product.reviews.length);
    }
    yield (product === null || product === void 0 ? void 0 : product.save({ validateBeforeSave: false }));
    res.status(200).json({
        success: true
    });
}));
// get all reviews by admin
exports.getAllReviewsAboutProduct = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield ProductModel_1.default.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler_1.ErrorHandler(`product not find`, 404));
    }
    res.status(200).json({
        message: true,
        reviews: product.reviews
    });
}));
// delete reviews by admin
exports.deleteReviewByAdmin = (0, AsyncError_1.AsyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield ProductModel_1.default.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler_1.ErrorHandler(`product not find`, 404));
    }
    const reviews = product.reviews.filter(rev => {
        var _a;
        if (rev._id) {
            return rev._id.toString() !== (((_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString()) || '');
        }
        return false;
    });
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });
    let rating = 0;
    if (reviews.length === 0) {
        rating = 0;
    }
    else {
        rating = avg / reviews.length;
    }
    const noOfReviews = reviews.length;
    yield ProductModel_1.default.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        noOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        message: true,
        // reviews,
        // ratings,
        // noOfReviews
    });
}));
