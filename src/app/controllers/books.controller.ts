import { Books } from "../models/books.model";
import { zodBookSchema } from "../utils/helper";

export const createBook = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        // console.log("createBook controller called", req.body);
        const zodBooks = await zodBookSchema.parseAsync( req.body );
        // console.log( "Validated Book Data:", zodBooks );
        
        const book = await Books.create( zodBooks );

        res.status( 201 ).json( {
            success: true,
            message: "Book created successfully",
            data: book,
            status: 201,
        } );
    }
    catch ( error )
    {
        // console.error( "Error in createBook controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            status: 500,
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        })

        // next(error);
    }
};

export const getBooks = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        // console.log("getBooks controller called");
        const books = await Books.find()

        res.status( 200 ).json( {
            success: true,
            message: "Books retrieved successfully",
            total: books?.length ?? 0,
            data: books
        } );
    }
    catch ( error )
    {
        // console.error( "Error in getBooks controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });

        // next(error);
    }
};

export const getBookById = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("getBookById controller called with ID:", bookId);
        
        const book = await Books.findById( bookId );
        if ( !book )
        {
            return res.status( 404 ).json( {
                success: false,
                message: "Book not found"
            } );
        }
        res.status( 200 ).json( {
            success: true,
            message: "Book retrieved successfully",
            data: book
        } );
    }
    catch ( error )
    {
        // console.error( "Error in getBookById controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });

        // next(error);
    }
};

export const updateBook = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("updateBook controller called with ID:", bookId);
        
        const zodBooks = await zodBookSchema.parseAsync( req.body );
        // console.log( "Validated Book Data for Update:", zodBooks );
        
        const book = await Books.findByIdAndUpdate( bookId, zodBooks, { new: true } );
        if ( !book )
        {
            return res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );
        }
        res.status( 200 ).json( {
            success: true,
            message: "Book updated successfully",
            data: book
        } );
    }
    catch ( error )
    {
        // console.error( "Error in updateBook controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });

        // next(error);
    }
}   

export const deleteBook = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("deleteBook controller called with ID:", bookId);
        
        const book = await Books.findByIdAndDelete( bookId );
        if ( !book )
        {
            return res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );
        }
        res.status( 200 ).json( {
            success: true,
            message: "Book deleted successfully",
            data: null
        } );
    }
    catch ( error )
    {
        // console.error( "Error in deleteBook controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        } );

        // next(error);
    }
};