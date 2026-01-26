import { Request, Response, NextFunction } from "express";
import { AppError } from "./index.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    // Log method, URL, and error message
    console.error(`[${req.method}] ${req.url} → ${err.message}`);

    // Send structured response for AppError
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }), // include details if present
    });
  }

  // Log generic/unhandled errors
  console.error("Unhandled error:", err);

  // Send generic 500 response
  return res.status(500).json({
    status: "error",
    message: "Something went wrong, please try again",
  });
};
