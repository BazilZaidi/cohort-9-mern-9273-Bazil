const errorHandler = (err, req, res, next) => {
  req.log.error(err, 'Unhandled error');

  const isErrorStatus = res.statusCode >= 400 && res.statusCode < 600;
  const statusCode = isErrorStatus ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };