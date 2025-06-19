import express, { Application, Request, Response } from 'express';

const app: Application = express()

app.use(express.json());

app.get( "/", ( req: Request, res: Response ) =>
{
    res.status( 200 ).json( {
        message: "Hello from library-api-express-ts-mongoose!!",
        status: 200,
        success: true,
        data: null
    } );
} );

export default app;