"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const borrow_model_1 = require("./borrow.model");
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
        min: [0, "Copies -> {VALUE} should not be a negative number"],
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
    try {
        const book = await exports.Books.findById(bookId);
        // console.log( "Adjusting copies for book:", bookId, "by quantity:", quantity, book );
        if (!book) {
            const err = new Error("Book not found");
            Object.assign(err, {
                name: "BookNotFoundError",
                status: 404,
                success: false,
                error: {
                    name: "[Static Method Error]",
                    message: "Book is not available",
                },
                data: null,
            });
            throw err;
        }
        ;
        if (book.copies < quantity || !book.availability) {
            if (!book.availability) {
                const err = new Error("Book is not available");
                Object.assign(err, {
                    name: "BookNotAvailableError",
                    status: 404,
                    success: false,
                    error: {
                        name: "[Static Method Error]",
                        message: "Book is not available",
                    },
                    data: null,
                });
                throw err;
            }
            if (book.copies < quantity) {
                const err = new Error("Not enough copies available");
                Object.assign(err, {
                    name: "BookNotEnoughSpaceError",
                    status: 404,
                    success: false,
                    error: {
                        name: "[Static Method Error]",
                        message: "Not enough copies available",
                    },
                    data: null,
                });
                throw err;
            }
            return false;
        }
        book.copies -= quantity;
        if (book.copies === 0) {
            book.availability = false;
        }
        await book.save();
        return true;
    }
    catch (error) {
        // console.error( "[Static Method Error] Failed to adjust copies after borrow:", error );
        throw error instanceof Error ? error : new Error("Unknown error");
        return false;
    }
});
// Pre-find middleware: normalize genre filter to uppercase
booksSchema.pre("find", function (next) {
    const query = this.getQuery();
    if (query?.genre) {
        query.genre = query.genre.toUpperCase();
        console.log(`[Middleware] Normalized genre filter: ${query.genre}`);
    }
    next();
});
// Pre-save middleware: set availability based on copies
booksSchema.pre("save", function (next) {
    console.log(`[Pre-Save] Copies: ${this.copies}, Availability: ${this.availability}`);
    if (this.copies === 0) {
        this.availability = false;
        next();
    }
    // if ( this.copies > 0 )
    // {
    //     this.availability = true;
    // }
    next();
});
// delete borrow records when a book is deleted
booksSchema.post("findOneAndDelete", async function (doc, next) {
    try {
        if (doc) {
            // console.log( `[Post-Delete] Book deleted: ${ doc.title }` );
            const deleted = await borrow_model_1.Borrow.deleteMany({ book: doc._id });
        }
        next();
    }
    catch (error) {
        console.error("[Post-Delete Error] Failed to delete borrow records:", error);
        next(error);
    }
});
// availability control on update when copies are updated or availability is set to false if copies are 0 no force update return error to the user
booksSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();
        if (!update || Array.isArray(update))
            return next();
        const query = this.getQuery();
        const current = await this.model.findOne(query);
        if (!current) {
            const err = new Error("Book not found");
            Object.assign(err, {
                name: "BookNotFoundError",
                status: 404,
                success: false,
                error: {
                    name: "[Pre-Update Error]",
                    message: "Book not found",
                },
                data: null,
            });
            throw err;
        }
        let copies = update.copies ?? update.$set?.copies ?? current.copies;
        let availability = update.availability ?? update.$set?.availability ?? current.availability;
        // console.log( `[Pre-Update] Current Copies: ${ current.copies }, Current Availability: ${ current.availability }` );
        // console.log( `[Pre-Update] Input Copies: ${ copies }, Input Availability: ${ availability }` );
        if (copies === 0) {
            update.$set = {
                ...update.$set,
                availability: false,
            };
            this.setUpdate(update);
            availability = false;
        }
        if (copies === 0 && availability === true) {
            const err = new Error("Cannot set availability to true when copies are 0.");
            Object.assign(err, {
                name: "InvalidAvailabilityUpdateError",
                status: 400,
                success: false,
                error: {
                    name: "[Pre-Update Error]",
                    message: "Cannot set availability to true when copies are 0",
                },
                data: null,
            });
            throw err;
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.Books = (0, mongoose_1.model)("Books", booksSchema);
