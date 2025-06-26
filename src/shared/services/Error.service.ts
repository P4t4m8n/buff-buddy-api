import { ZodError } from "zod";
import { Prisma } from "../../../prisma/generated/prisma";

export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly validationErrors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    validationErrors?: Record<string, string>
  ) {
    super(message);

    // Set prototype explicitly for extending built-ins
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.status = statusCode;
    this.isOperational = isOperational;
    this.validationErrors = validationErrors;

    // Capture stack trace for better debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static create(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    validationErrors?: Record<string, string>
  ): AppError {
    const newError = new AppError(
      message,
      statusCode,
      isOperational,
      validationErrors
    );
    console.error(newError);
    return newError;
  }

  public static handleResponse(error: unknown) {
    const returnError: {
      status?: number;
      message?: string;
      validationErrors?: Record<string, string>;
    } = {};

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      returnError.status = 400;
      returnError.message = "Validation failed";
      returnError.validationErrors = {};
      for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (path && !returnError.validationErrors[path]) {
          returnError.validationErrors[path] = issue.message;
        }
      }
    }
    // Handle Prisma errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //Unique constraint failed
      if (error.code === "P2002") {
        returnError.status = 409;
        returnError.message = "A record with this value already exists.";
        returnError.validationErrors = {};
        if (Array.isArray(error.meta?.target)) {
          for (const field of error.meta.target) {
            returnError.validationErrors[field] = "This value must be unique.";
          }
        }
      } else {
        returnError.status = 400;
        returnError.message = error.message || "Database error";
      }
    }
    // Handle custom AppError
    else if (error instanceof AppError && error?.status < 500) {
      returnError.status = error.status;
      returnError.validationErrors = error.validationErrors;
      returnError.message = error.message;
    }
    // Fallback for unknown errors
    else {
      const err = AppError.create(`${error}`, 500, false);
      returnError.status = err.status;
      returnError.message = err.message;
    }

    return {
      message: returnError.message,
      errors: returnError.validationErrors,
      status: returnError.status,
    };
  }
}
