import app from "./app";
import config from "./config";
import connectDB from "./config/database";

async function startServer() {
  try {
    console.log("Mongo URI exists:", !!config.mongoURI);
    console.log("Mongo URI prefix:", config.mongoURI?.slice(0, 20));
    await connectDB();

    // listen to port
    const server = app.listen(config.port, () => {
      console.log(`app is listening to port ${config.port}`);
    });

    //? handle unexpected error
    process.on("unhandlededRejection", (error) => {
      console.log(error);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");

      server.close(() => {
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received. Shutting down gracefully...");

      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("failed to start server", error);
    process.exit(1);
  }
}

startServer();
