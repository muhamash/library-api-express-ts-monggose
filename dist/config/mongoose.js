"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function mongooseConnect() {
    try {
        const uri = process.env.MONGO_DB_URI;
        if (!uri) {
            throw new Error("❌ MONGO_DB_URI is not defined in environment variables");
        }
        await mongoose_1.default.connect(uri);
        console.log("🥭 Connected to MongoDB Using Mongoose!");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}
exports.default = mongooseConnect;
