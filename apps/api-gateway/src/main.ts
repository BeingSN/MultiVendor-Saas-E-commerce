/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

// Apply rate limiting to all requests

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100), // limit each IP to 100 requests per windowMs for unauthenticated users, 1000 for authenticated
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  // Use default keyGenerator which handles IPv6 correctly
});

app.use(limiter);

app.use("/", proxy("http://localhost:6001"));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Please stop the other process or use a different port.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
