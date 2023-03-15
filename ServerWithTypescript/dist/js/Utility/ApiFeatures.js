"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeature = void 0;
class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};
        this.query = this.query.find(Object.assign({}, keyword));
        return this;
    }
    filter() {
        const copyStr = Object.assign({}, this.queryStr);
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete copyStr[key]);
        let qrystr = JSON.stringify(copyStr);
        qrystr = qrystr.replace(/\b(gt|gte|lte|lt)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(qrystr));
        // console.log(qrystr);
        return this;
    }
    pagination(resultPerPage) {
        const currPage = Number(this.queryStr.page) || 1;
        // for skiping products logic
        const skipProducts = resultPerPage * (currPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skipProducts);
        return this;
    }
}
exports.ApiFeature = ApiFeature;
