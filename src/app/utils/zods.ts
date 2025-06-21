import { z } from "zod";

const allowedGenres = [
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
] as const;

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
] as const;

export const zodBookSchema = z.object( {
    title: z.string().min( 1, "Title is required and minimum 1 char" ),
    author: z.string().min( 1, "Author is required and minimum 1 char" ),
    genre: z
        .string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val as any ), {
            message:
                "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        } ),
    isbn: z.string().min( 1, "ISBN is required and minimum 1 char" ),
    description: z
        .string()
        .min( 8, "Description must be at least 8 characters long" )
        .max( 100, "Description must not exceed 100 characters" )
        .optional(),
    copies: z
        .number()
        .int()
        .nonnegative( { message: "Copies must be a non-negative number" } )
        .refine( ( value ) => value >= 0, {
            message: "Copies must be a non-negative number",
        } ),
    availability: z.boolean().optional(),
} );

export const zodBorrowSchema = z.object( {
    book: z.string(),
    quantity: z
        .number()
        .int()
        .min( 1, "Quantity must be at least 1" )
        .refine( ( value ) => value >= 1, {
            message: "Quantity must be at least 1",
        } ),
    dueDate: z
        .string()
        .transform( ( val ) => new Date( val ) )
        .refine( ( date ) => date.getTime() > Date.now(), {
            message: "Due date must be in the future",
        } ),
} );

export const zodUpdateBookSchema = zodBookSchema.partial().extend( {
    title: z.string().min( 1, "and minimum 1 char" ).optional(),
    isbn: z.string().min( 1, "and minimum 1 char" ).optional(),
    description: z
        .string()
        .min( 8, "Description must be at least 8 characters long" )
        .max( 100, "Description must not exceed 100 characters" )
        .optional(),
    copies: z
        .number()
        .int()
        .nonnegative( { message: "Copies must be a non-negative number" } )
        .refine( ( value ) => value >= 0, {
            message: "Copies must be a non-negative number",
        } ).optional(),
    genre: z
        .string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val as any ), {
            message:
                "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        } ).optional(),
    author: z.string().min( 1, "Author is required and minimum 1 char" ).optional(),
    availability: z.boolean().optional(),
} ).refine( ( data ) =>
{
    return Object.keys( data ).some( ( key ) =>
    {
        return key !== "book" && data[ key as keyof typeof data ] !== undefined;
    } );
}, {
    message: "At least one field must be provided for update",
} );

export const zodFilterSchema = z.object( {
    filter: z.string()
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => allowedGenres.includes( val as any ), {
            message:
                "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        } ).optional(),
    sortBy: z.enum( allowedFiltersProperties ).optional(),
    sort: z.enum( [ "asc", "desc" ] ).optional(),
    limit: z.string().transform( Number ).default("10").optional(),
} );