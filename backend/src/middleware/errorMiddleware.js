import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (err.name === 'CastError') {
    error = new ApiError(404, 'Resource not found');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(409, `${field} already exists`);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    error = new ApiError(400, message);
  }

  const statusCode = error.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Unexpected server error'
      : error.message || 'Unexpected server error';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
