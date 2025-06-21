"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const home_controller_1 = require("./controllers/home.controller");
const books_route_1 = require("./routes/books.route");
const borrow_route_1 = require("./routes/borrow.route");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json({ type: '*/*' }));
app.use((req, res, next) => {
    const type = req.headers['content-type'] || '';
    if (!type.includes('application/json')) {
        req.headers['content-type'] = 'application/json';
    }
    next();
});
app.use(express_1.default.json());
app.get("/", home_controller_1.home);
app.use("/api/books", books_route_1.booksRouter);
app.use("/api/borrow", borrow_route_1.borrowRouter);
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});
app.use((error, req, res, next) => {
    if (error) {
        // console.log( "error", typeof error );
        // const errorMessage = JSON.stringify(error);
        res.status(400).json({ message: "Something went wrong from global error handler", status: 500,
            success: false,
            error: {
                name: error.name || "UnknownError",
                message: error.message || "An unknown error occurred",
                ...error,
                stack: error.stack || "No stack trace available"
            }
        });
    }
});
exports.default = app;
