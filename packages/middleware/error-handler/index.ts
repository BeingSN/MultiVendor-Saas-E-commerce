export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not Found error

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

//validation Error (use for joi/zod/react-hook-form validation errors)

export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

//Authentication Error
export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}

//Fobidden Error
export class ForbiddenError extends AppError {
  constructor(message = "Access Forbidden") {
    super(message, 403);
  }
}

//Rate Limit Error
export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later.") {
    super(message, 429);
  }
}
