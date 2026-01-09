const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // 🔹 Duplicate key error (MongoDB)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    
    message = `${field} already exists`;
  }

  // 🔹 Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorHandler;
