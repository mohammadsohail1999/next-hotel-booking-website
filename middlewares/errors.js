import ErrorHandler from "../utils/ErrorHandler";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };

  error.message = err.message;

  //Wrong mongose Obj ID
  if (err.name === "CastError") {
    const message = `Resource not found,Invalid ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  //validation error by mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors);
    const messageArr = errors.map((el) => el.properties.message);
    let message =
      messageArr.length > 1 ? messageArr.join(" & ") : messageArr[0];
    error = new ErrorHandler(message, 404);
  }

  res.status(err.statusCode).json({
    success: false,
    error,
    message: error.message,
    stack: error.stack,
  });
};
