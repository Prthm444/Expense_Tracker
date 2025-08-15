import { ApiError } from "../utils/Error.utils.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    message = `Duplicate field value entered for ${Object.keys(err.keyValue)[0]}. Please use another value.`;
  }

  res.status(statusCode).json({
    message,
    ...(errors.length > 0 && { errors }), // Only include errors if they exist
  });
};

export { errorHandler };
