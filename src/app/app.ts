import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { home } from './controllers/home.controller';
import { booksRouter } from './routes/books.route';
import { borrowRouter } from './routes/borrow.route';


const app: Application = express()

app.use(cors({ origin: '*' }));
app.use( express.json( { type: '*/*' } ) );
app.use( ( req, res, next ) =>
{
    const type = req.headers[ 'content-type' ] || '';
    if ( !type.includes( 'application/json' ) )
    {
        req.headers[ 'content-type' ] = 'application/json';
    }
    next();
} );
app.use( express.json() );

app.get( "/", home );
app.use( "/api/books", booksRouter );
app.use( "/api/borrow", borrowRouter );

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        // console.log( "error", typeof error );
        // const errorMessage = JSON.stringify(error);
        res.status(400).json({ message: "Something went wrong from global error handler",status: 500,
            success: false,
            error: {
                name: error.name || "UnknownError",
                message: error.message || "An unknown error occurred",
                stack: error.stack || "No stack trace available",
                ...(error as any)
            }
        } )
    }
})

export default app;