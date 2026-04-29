const { sendError } = require("../utils/response");

const notFoundHandler = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error", err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  return sendError(res, message, status);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
