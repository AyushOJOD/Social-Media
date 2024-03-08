import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
  });
  console.log("Database connected!");
}
