import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "../../../packages/middleware/error-handler/error-middleware.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth-router.js";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
dotenv.config();

// Load swagger document - path works from dist folder at runtime
const swaggerPath = join(
  process.cwd(),
  "apps",
  "auth-service",
  "dist",
  "apps",
  "auth-service",
  "src",
  "swagger-output.json"
);
const swaggerDocument = JSON.parse(readFileSync(swaggerPath, "utf-8"));
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

//Routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/docs`);
});

server.on("error", console.error);
