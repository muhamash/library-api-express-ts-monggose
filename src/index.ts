import dotenv from "dotenv";
import app from './app/app';
import mongooseConnect from './config/mongoose';

dotenv.config();

const port = process.env.PORT || 3000;

const main = async () =>
{
    try
    {
        mongooseConnect();

        app.listen( port, () =>
        {
            console.log( `🌎 Server running at http://localhost:${ port }` );
        } );
    } catch ( error )
    {
        console.error( "❌ Failed to connect to MongoDB:", error );
        process.exit( 1 );
    }
};

main();