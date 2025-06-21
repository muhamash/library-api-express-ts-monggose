"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZodError = void 0;
const isZodError = (error) => {
    return error && typeof error === "object" && "issues" in error && Array.isArray(error.issues);
};
exports.isZodError = isZodError;
