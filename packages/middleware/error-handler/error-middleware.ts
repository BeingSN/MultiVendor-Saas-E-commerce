import { Response, Request } from "express";
import { AppError } from "./index.js";

export const errorMiddleware = (err: Error, req: Request, res: Response) => {
  if (err instanceof AppError) {
    const appError = err as AppError;
    console.log(`Error ${req.method} ${req.url} - ${appError.message}`);
    return res.status(appError.statusCode).json({
      status: "error",
      message: appError.message,
      ...(appError.details && { details: appError.details }),
    });
  }
  console.log("Unhandled error:", err);
  return res.status(500).json({
    error: "Something went wrong, please try again",
  });
};
