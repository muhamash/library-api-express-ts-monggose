"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Books",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer',
        },
    },
    dueDate: { type: Date, required: true },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
