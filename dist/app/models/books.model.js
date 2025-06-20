"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const booksSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        max: [20, "Title -> {VALUE} should not longer than 20 character"],
        min: [1, "Title -> {VALUE} should not shorter than 1 character"],
        unique: [true, "Title -> {VALUE} should be unique; Maybe {VALUE} already exists on the database"],
    },
    author: {
        type: String,
        required: true,
        max: [20, "Author -> {VALUE} should not longer than 20 character"],
        min: [1, "Author -> {VALUE} should not shorter than 1 character"],
    },
    genre: {
        type: String,
        required: true,
        uppercase: true,
        enum: {
            values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
            message: "Genre -> {VALUE} is not supported, please use one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        },
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "No description provided",
        max: [100, "Description -> {VALUE} should not longer than 100 character"],
        min: [8, "Description -> {VALUE} should not shorter than 1 character"],
    },
    copies: {
        type: Number,
        required: true,
        min: [0, "Copies -> {VALUE} should not be a non-negative number"],
    },
    availability: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// static method for adjusting copies after borrowing
booksSchema.static("adjustCopiesAfterBorrow", async function (bookId, quantity) {
    const book = await exports.Books.findById(bookId);
    // console.log( "Adjusting copies for book:", bookId, "by quantity:", quantity, book );
    if (!book)
        throw new Error('Book not found');
    if (book.copies < quantity && book.availability) {
        throw new Error('Not enough copies available');
    }
    book.copies -= quantity;
    if (book.copies === 0) {
        book.availability = false;
    }
    await book.save();
    return true;
});
// pre query middleware for filtering books based on queries
booksSchema.pre("find", function (next) {
    if (!(this instanceof mongoose_1.default.Query))
        return next();
    const query = this.getQuery();
    const options = this?.options;
    if (options?.filter) {
        query.genre = options.filter;
    }
    const sortField = options?.sortBy || 'createdAt';
    const sortOrder = options?.sort === 'desc' ? -1 : 1;
    this.sort({ [sortField]: sortOrder });
    const limitValue = parseInt(options?.limit) || 10;
    this.limit(limitValue);
    console.log(`[Query Middleware] filter=${options?.filter}, sort=${sortField} ${sortOrder}, limit=${limitValue}`);
    next();
});
exports.Books = (0, mongoose_1.model)("Books", booksSchema);
