import { NextFunction, Request, Response } from 'express';

export const home = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try {
        res.status( 200 ).json( {
            message: "Hello from 📖 Assignment: Library Management API with Express, TypeScript & MongoDB",
            status: 200,
            success: true,
        } );
    }
    catch ( error )
    {
        console.error("Error in home controller:", error);
        res.status( 500 ).json( { message: "Internal Server Error", status: 500, success: false } );

       next(error);     
    }
}