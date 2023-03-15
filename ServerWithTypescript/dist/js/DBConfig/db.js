"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
class ConnectDB {
    constructor(db) {
        this.db = db;
    }
    dbconnect() {
        mongoose_1.default.connect(this.db).then(() => {
            console.log("Database Connected successfully");
        }).catch(() => {
            console.log("Database Not Connected");
        });
    }
}
exports.ConnectDB = ConnectDB;
