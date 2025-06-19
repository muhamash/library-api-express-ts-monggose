import express, { Application, Request, Response } from 'express';
import { home } from './controllers/home.controller';
import { booksRouter } from './routes/books.route';

const app: Application = express()

app.use( express.json() );

app.get( "/", home );
app.use( "/api", booksRouter );


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        // console.log( "error", typeof error );
        // const errorMessage = JSON.parse(error);
        res.status(400).json({ message: "Something went wrong from global error handler",status: 500,
            success: false,
            error
        } )
    }
})

export default app;