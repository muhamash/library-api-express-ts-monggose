"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowBooksSummary = exports.borrowABook = void 0;
const books_model_1 = require("../models/books.model");
const borrow_model_1 = require("../models/borrow.model");
const helper_1 = require("../utils/helper");
const borrowABook = async (req, res) => {
    // console.log( "borrowABook controller called" );
    try {
        console.log("Request Body:", req.body);
        const zodBook = await helper_1.zodBorrowSchema.parseAsync(req.body);
        const updatedBook = await books_model_1.Books.adjustCopiesAfterBorrow(zodBook.book, zodBook.quantity);
        console.log("Validated Borrow Data:", zodBook, updatedBook);
        if (updatedBook) {
            const borrowedBook = await borrow_model_1.Borrow.create(req.body);
            res.status(200).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrowedBook,
            });
        }
    }
    catch (error) {
        console.error("Error in borrowABook controller:", error);
        if (error instanceof Error) {
            if (error.message === "Book not found") {
                res.status(404).json({
                    message: error.message,
                    success: false,
                    error: { name: error.name, message: error.message },
                });
                return;
            }
            if (error.message === "Not enough copies available") {
                res.status(400).json({
                    message: error.message,
                    success: false,
                    error: { name: error.name, message: error.message },
                });
                return;
            }
        }
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });
    }
};
exports.borrowABook = borrowABook;
const BorrowBooksSummary = async (req, res) => {
    try {
        const summary = await borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            {
                $unwind: '$bookDetails'
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn'
                    },
                    totalQuantity: 1,
                }
            }
        ]);
        if (summary.length === 0) {
            res.status(404).json({
                success: false,
                message: "No borrow records found, summary is empty",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Borrow summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        console.error("Error in BorrowBooksSummary controller:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });
    }
};
exports.BorrowBooksSummary = BorrowBooksSummary;
