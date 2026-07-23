import mongoose from "mongoose";
import config from ".";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(config.mongoURI, {
    ...config.databaseConfig,
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  isConnected = true;
  console.log("Database connected!");
}