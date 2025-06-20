"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodBorrowSchema = exports.zodBookSchema = void 0;
const zod_1 = require("zod");
exports.zodBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    genre: zod_1.z
        .enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"])
        .refine((val) => ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"].includes(val), {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
    }),
    isbn: zod_1.z.string().min(1, "ISBN is required"),
    description: zod_1.z
        .string()
        .min(8, "Description must be at least 8 characters long")
        .max(100, "Description must not exceed 100 characters")
        .optional(),
    copies: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Copies must be a non-negative number" })
        .refine((value) => value >= 0, {
        message: "Copies must be a non-negative number",
    }),
    availability: zod_1.z.boolean().default(true),
});
exports.zodBorrowSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, "Book ID is required"),
    quantity: zod_1.z
        .number()
        .int()
        .min(1, "Quantity must be at least 1")
        .refine((value) => value >= 1, {
        message: "Quantity must be at least 1",
    }),
    dueDate: zod_1.z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => date.getTime() > Date.now(), {
        message: "Due date must be in the future",
    }),
});
