import { model, Schema } from "mongoose";
import { IBooks, IBookStaticMethod } from "../interfaces/books.interface";
import { Borrow } from "./borrow.model";

const booksSchema = new Schema<IBooks>( {
    title: {
        type: String,
        required: true,
        max: [ 20, "Title -> {VALUE} should not longer than 20 character" ],
        min: [ 1, "Title -> {VALUE} should not shorter than 1 character" ],
        unique: [ true, "Title -> {VALUE} should be unique; Maybe {VALUE} already exists on the database" ],
    },

    author: {
        type: String,
        required: true,
        max: [ 20, "Author -> {VALUE} should not longer than 20 character" ],
        min: [ 1, "Author -> {VALUE} should not shorter than 1 character" ],
    },

    genre: {
        type: String,
        required: true,
        uppercase: true,
        enum: {
            values: [ "FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY" ],
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
        max: [ 100, "Description -> {VALUE} should not longer than 100 character" ],
        min: [ 8, "Description -> {VALUE} should not shorter than 1 character" ],
    },

    copies: {
        type: Number,
        required: true,
        min: [ 0, "Copies -> {VALUE} should not be a non-negative number" ],
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
} );

// static method for adjusting copies after borrowing
booksSchema.static( "adjustCopiesAfterBorrow", async function ( bookId: string, quantity: number ): Promise<boolean>
{
    try
    {
        const book = await Books.findById( bookId );
        // console.log( "Adjusting copies for book:", bookId, "by quantity:", quantity, book );
  
        if ( !book )
        {
            const err = new Error( "Book not found" );
            Object.assign( err, {
                name: "BookNotFoundError",
                status: 404,
                success: false,
                error: {
                    name: "[Static Method Error]",
                    message: "Book is not available",
                },
                data: null,
            } );
            throw err;
        };
  
        
        if ( book.copies < quantity || !book.availability )
        {
            if ( book.copies < quantity )
            {
                const err = new Error( "Not enough copies available" );
                Object.assign( err, {
                    name: "BookNotEnoughSpaceError",
                    status: 404,
                    success: false,
                    error: {
                        name: "[Static Method Error]",
                        message: "Not enough copies available",
                    },
                    data: null,
                } );
                throw err;
            }

            if ( !book.availability )
            {
                const err = new Error( "Book is not available" );
                Object.assign( err, {
                    name: "BookNotAvailableError",
                    status: 404,
                    success: false,
                    error: {
                        name: "[Static Method Error]",
                        message: "Book is not available",
                    },
                    data: null,
                } );
                throw err;
            }

            return false;
        }
  
        book.copies -= quantity;
  
        if ( book.copies === 0 )
        {
            book.availability = false;
        }
  
        await book.save();
        return true
    }
    catch ( error )
    {
        console.error( "[Static Method Error] Failed to adjust copies after borrow:", error );
        throw error instanceof Error ? error : new Error( "Unknown error" );

        return false;
        
    }
} );

// Pre-find middleware: normalize genre filter to uppercase
booksSchema.pre( "find", function ( next )
{
    const query = this.getQuery();

    if ( query?.genre )
    {
        query.genre = query.genre.toUpperCase();
        console.log( `[Middleware] Normalized genre filter: ${ query.genre }` );
    }

    next();
} );

// Pre-save middleware: set availability based on copies
booksSchema.pre( "save", function ( next )
{
    console.log( `[Pre-Save] Copies: ${ this.copies }, Availability: ${ this.availability }` );
    if ( this.copies === 0 )
    {
        this.availability = false;
        next()
    }
    else
    {
        next();
    }

    // if ( this.copies > 0 )
    // {
    //     this.availability = true;
    // }
  
    next();
} );

// delete borrow records when a book is deleted
booksSchema.post( "findOneAndDelete", async function ( doc, next )
{
    try
    {
        if ( doc )
        {
            // console.log( `[Post-Delete] Book deleted: ${ doc.title }` );
            const deleted = await Borrow.deleteMany( { book: doc._id } );
        }

        next();
    }
    catch ( error )
    {
        console.error( "[Post-Delete Error] Failed to delete borrow records:", error );

        next(error as Error);
    }
} );

export const Books = model<IBooks, IBookStaticMethod>( "Books", booksSchema );