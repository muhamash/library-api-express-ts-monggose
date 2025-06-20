"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app/app"));
const mongoose_1 = __importDefault(require("./config/mongoose"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const main = async () => {
    try {
        (0, mongoose_1.default)();
        app_1.default.listen(port, () => {
            console.log(`🌎 Server running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
main();
