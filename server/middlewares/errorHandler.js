export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log full error details server-side for debugging
  console.error(`[${new Date().toISOString()}] Error ${statusCode}: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Never expose internal error details to client
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : (err.message || "An error occurred"),
  });
};
