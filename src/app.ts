import cors from "cors";
import "dotenv/config";
import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEV_URL,
];

// global middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());

// Health Check
app.get("/", (_req, res) => {
  res.send({
    success: true,
    message: "GM Aviation API is running.",
  });
});

// API Routes
app.use("/api/v1", router);

// Not Found
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
