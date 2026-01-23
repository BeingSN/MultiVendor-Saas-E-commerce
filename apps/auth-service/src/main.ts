import express from "express";
import cors from "cors";
import { errorMiddleware } from "../../../packages/middleware/error-handler/error-middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

app.use(errorMiddleware);
app.use(cookieParser());

const port = process.env.PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);
});

server.on("error", console.error);
