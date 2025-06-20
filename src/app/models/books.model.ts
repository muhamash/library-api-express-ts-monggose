import mongoose, { model, Schema } from "mongoose";

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
booksSchema.static( "adjustCopiesAfterBorrow", async function ( bookId: string, quantity: number )
{
    const book = await Books.findById( bookId );
    // console.log( "Adjusting copies for book:", bookId, "by quantity:", quantity, book );
  
    if ( !book ) throw new Error( 'Book not found' );
  
    if ( book.copies < quantity && book.availability )
    {
        throw new Error( 'Not enough copies available' );
    }
  
    book.copies -= quantity;
  
    if ( book.copies === 0 )
    {
        book.availability = false;
    }
  
    await book.save();
    return true
} );

// pre query middleware for filtering books based on queries
booksSchema.pre( "find", function ( next )
{
    if ( !( this instanceof mongoose.Query ) ) return next();
  
    const query = this.getQuery() as any;
    const options = this.options as any;
  
    if ( options?.filter )
    {
        query.genre = options.filter;
    }
  
    const sortField = options?.sortBy || 'createdAt';
    const sortOrder = options?.sort === 'desc' ? -1 : 1;
    this.sort( { [ sortField ]: sortOrder } );
  
    const limitValue = parseInt( options?.limit ) || 10;
    this.limit( limitValue );
  
    console.log(`[Query Middleware] filter=${options?.filter}, sort=${sortField} ${sortOrder}, limit=${limitValue}`);
  
    next();
} );

export const Books = model<IBooks, IBookStaticMethod>( "Books", booksSchema );