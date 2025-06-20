import mongoose from "mongoose";

async function mongooseConnect(): Promise<void> {
  try {
    const uri = process.env.MONGO_DB_URI;

    if (!uri) {
      throw new Error("❌ MONGO_DB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("🥭 Connected to MongoDB Using Mongoose!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

export default mongooseConnect;