import http from "http";
import app from "./app";
import config from "./config";
import connectDB from "./config/database";
import { initializeSocket } from "./socket";

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDB();

    // listen to port
    server.listen(config.port, () => {
      console.log(`app is listening to port ${config.port}`);
    });

    initializeSocket(server);

    //? handle unexpected error
    process.on("unhandlededRejection", (error) => {
      console.log(error);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("failed to start server", error);
    process.exit(1);
  }
}

startServer();

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
