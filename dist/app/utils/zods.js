"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodFilterSchema = exports.zodUpdateBookSchema = exports.zodBorrowSchema = exports.zodBookSchema = void 0;
const zod_1 = require("zod");
const allowedGenres = [
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
];
const allowedFiltersProperties = [
    "title",
    "author",
    "genre",
    "isbn",
    "description",
    "copies",
    "availability",
    "createdAt",
    "updatedAt",
];
exports.zodBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required and minimum 1 char"),
    author: zod_1.z.string().min(1, "Author is required and minimum 1 char"),
    genre: zod_1.z
        .string()
        .transform((val) => val.toUpperCase())
        .refine((val) => allowedGenres.includes(val), {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
    }),
    isbn: zod_1.z.string().min(1, "ISBN is required and minimum 1 char"),
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
    availability: zod_1.z.boolean().optional(),
});
exports.zodBorrowSchema = zod_1.z.object({
    book: zod_1.z.string(),
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
exports.zodUpdateBookSchema = exports.zodBookSchema.partial().extend({
    title: zod_1.z.string().min(1, "and minimum 1 char").optional(),
    isbn: zod_1.z.string().min(1, "and minimum 1 char").optional(),
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
    }).optional(),
    genre: zod_1.z
        .string()
        .transform((val) => val.toUpperCase())
        .refine((val) => allowedGenres.includes(val), {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
    }).optional(),
    author: zod_1.z.string().min(1, "Author is required and minimum 1 char").optional(),
    availability: zod_1.z.boolean().optional(),
}).refine((data) => {
    return Object.keys(data).some((key) => {
        return key !== "book" && data[key] !== undefined;
    });
}, {
    message: "At least one field must be provided for update",
});
exports.zodFilterSchema = zod_1.z.object({
    filter: zod_1.z.string()
        .transform((val) => val.toUpperCase())
        .refine((val) => allowedGenres.includes(val), {
        message: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
    }).optional(),
    sortBy: zod_1.z.enum(allowedFiltersProperties).optional(),
    sort: zod_1.z.enum(["asc", "desc"]).optional(),
    limit: zod_1.z.string().transform(Number).default("10").optional(),
});
