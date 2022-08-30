import { getSession } from "next-auth/react";
import catchAsync from "../middlewares/catchAsync";
import ErrorHandler from "../utils/ErrorHandler";

export const protect = catchAsync(async (req, res, next) => {
  const session = await getSession({ req });
  if (!session) {
    throw new ErrorHandler("Please Login to access this page.", 401);
  }
  req.user = session.user;
  next();
});

export const userRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    } else {
      next();
    }
  };
};
