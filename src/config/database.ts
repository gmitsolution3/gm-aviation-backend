// database.ts
import mongoose from "mongoose";
import config from ".";

// Must run before any model files are imported/registered
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 10000);

let connectionPromise: Promise<typeof mongoose> | null = null;

export default async function connectDB() {
  // Already connected — reuse it
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // A connection attempt is already in flight — wait for it instead of starting a new one
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(config.mongoURI, {
      ...config.databaseConfig,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then((m) => {
      console.log("Database connected!");
      return m;
    })
    .catch((err) => {
      // Reset so the next request can retry instead of being stuck on a rejected promise forever
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}