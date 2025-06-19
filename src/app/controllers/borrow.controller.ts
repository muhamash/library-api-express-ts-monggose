import { Request, Response } from 'express';
import { Books } from '../models/books.model';
import { Borrow } from '../models/borrow.model';
import { zodBorrowSchema } from '../utils/helper';

export const borrowABook = async ( req: Request, res: Response ): Promise<void> =>
{
    // console.log( "borrowABook controller called" );
    try
    {
        const zodBook = await zodBorrowSchema.parseAsync( req.body );

        const updatedBook = await Books.adjustCopiesAfterBorrow( zodBook.book, zodBook.quantity );

        console.log( "Validated Borrow Data:", zodBook, updatedBook );
        
        if ( updatedBook )
        {
            const borrowedBook = await Borrow.create( req.body );

            res.status( 200 ).json( {
                success: true,
                message: "Book borrowed successfully",
                data: borrowedBook,
            } );
        }
        else
        {
            res.status( 400 ).json( {
                success: false,
                message: "Failed to borrow the book",
                error: error instanceof Error ? { name: error.name, message: error.message } : error,
            } );
        }

    }
    catch ( error )
    {
        console.error( "Error in borrowABook controller:", error );
      
        if ( error instanceof Error )
        {
            if ( error.message === "Book not found" )
            {
                return res.status( 404 ).json( {
                    message: error.message,
                    success: false,
                    error: { name: error.name, message: error.message },
                } );
            }
      
            if ( error.message === "Not enough copies available" )
            {
                return res.status( 400 ).json( {
                    message: error.message,
                    success: false,
                    error: { name: error.name, message: error.message },
                } );
            }
        }
      
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? { name: error.name, message: error.message } : error,
        } );
    }
};