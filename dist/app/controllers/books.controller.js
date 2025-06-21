"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const books_model_1 = require("../models/books.model");
const zods_1 = require("../utils/zods");
const createBook = async (req, res, next) => {
    try {
        const zodBooks = await zods_1.zodBookSchema.parseAsync(req.body);
        // console.log( "Validated Book Data:", zodBooks );
        const book = await books_model_1.Books.create(zodBooks);
        // console.log( "Book created successfully:", req.body, book );
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
        // console.log( "getBooks controller called with query:", req.query );
        const zodBody = await zods_1.zodFilterSchema.parseAsync(req.query);
        console.log("Validated Query Parameters:", zodBody);
        const filter = zodBody.filter;
        const sortBy = zodBody.sortBy || 'createdAt';
        const sort = zodBody.sort === 'desc' ? -1 : 1;
        const limit = parseInt(zodBody.limit) || 10;
        // console.log(filter?.toUpperCase())
        const books = await books_model_1.Books.find(filter ? { genre: filter } : {})
            .sort({ [sortBy]: sort })
            .limit(limit);
        if (!books.length) {
            res.status(404).json({
                success: false,
                message: `${filter ? `No books found for genre '${filter}'` : "No books found"}`,
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
        // console.error( "Error in getBooks controller:", error );
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
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
                message: "Book not found",
                data: null
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
        const zodBooks = await zods_1.zodUpdateBookSchema.parseAsync(req.body);
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
