"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const books_model_1 = require("../models/books.model");
const helper_1 = require("../utils/helper");
const createBook = async (req, res, next) => {
    try {
        // console.log("createBook controller called", req.body);
        const zodBooks = await helper_1.zodBookSchema.parseAsync(req.body);
        // console.log( "Validated Book Data:", zodBooks );
        const book = await books_model_1.Books.create(zodBooks);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
            status: 201,
        });
    }
    catch (error) {
        // console.error( "Error in createBook controller:", error );
        res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });
        // next(error);
    }
};
exports.createBook = createBook;
const getBooks = async (req, res) => {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy || 'createdAt';
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const limit = parseInt(req.query.limit) || 10;
        // console.log(filter?.toUpperCase())
        const books = await books_model_1.Books.find(filter ? { genre: filter } : {})
            .sort({ [sortBy]: sort })
            .limit(limit);
        if (!books.length) {
            res.status(404).json({
                success: false,
                message: `No books found on query: ${filter ?? sortBy ?? sort ?? limit}`,
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        console.error("Error in getBooks controller:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBooks = getBooks;
const getBookById = async (req, res, next) => {
    try {
        const bookId = req.params?.id;
        // console.log("getBookById controller called with ID:", bookId);
        const book = await books_model_1.Books.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        // console.error( "Error in getBookById controller:", error );
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });
        // next(error);
    }
};
exports.getBookById = getBookById;
const updateBook = async (req, res, next) => {
    try {
        const bookId = req.params?.id;
        // console.log("updateBook controller called with ID:", bookId);
        const zodBooks = await helper_1.zodUpdateBookSchema.parseAsync(req.body);
        // console.log( "Validated Book Data for Update:", zodBooks );
        const book = await books_model_1.Books.findByIdAndUpdate(bookId, zodBooks, { new: true });
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    }
    catch (error) {
        // console.error( "Error in updateBook controller:", error );
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });
        // next(error);
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params?.id;
        // console.log("deleteBook controller called with ID:", bookId);
        const book = await books_model_1.Books.findByIdAndDelete(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        // console.error( "Error in deleteBook controller:", error );
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });
        // next(error);
    }
};
exports.deleteBook = deleteBook;
