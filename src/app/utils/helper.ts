import { z } from "zod";

export const zodBookSchema = z.object( {
    title: z.string().min( 1, "Title is required" ),
    author: z.string().min( 1, "Author is required" ),
    genre: z.enum( [ "FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY" ], {
        errorMap: {
            invalid_type: "Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        },
    } ),
    isbn: z.string().min( 1, "ISBN is required" ),
    description: z.string().min( 8, "Description must be at least 8 characters long" ).max( 100, "Description must not exceed 100 characters" ).optional(),
    copies: z.number().int().nonnegative( "Copies must be a non-negative number" ).refine( ( value ) => value >= 0, {
        message: "Copies must be a non-negative number",
    } ),
    availability: z.boolean().default( true ),
} );