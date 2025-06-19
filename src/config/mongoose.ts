import mongoose from "mongoose";

async function mongooseConnect () : void
{
    try {
        await mongoose.connect(  process.env.MONGO_DB_URI  );
        
        console.log( "🥭 Connected to MongoDB Using Mongoose!" );
    }
    catch ( error )
    {
        console.log(error)
    }
};

export default mongooseConnect;