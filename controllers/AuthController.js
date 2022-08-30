import catchAsync from "../middlewares/catchAsync";
import UserModel from "../Models/UserModel";
import { v2 } from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler";
import transport from "../utils/nodeEmailSend";
import crypto from "crypto";

v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const registerUser = catchAsync(async (req, res, next) => {
  const { name, password, email } = req.body;
  

  const image = await v2.uploader.upload(req.body.image, {
    folder: "Bookit",
    transformation: [{ width: 150, height: 150 }],
  });

  const user = await UserModel.create({
    name,
    password,
    email,
    avatar: {
      public_id: image.public_id || "default",
      url:
        image.secure_url ||
        "https://api-private.atlassian.com/users/8f525203adb5093c5954b43a5b6420c2/avatar",
    },
  });

  res.status(200).json({
    success: true,
    message: "User is Register Successfully",
  });
});

export const currentUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ErrorHandler("This User did'nt Exist", 404);
  }

  const token = await user.getResetPasswordToken();

  let mailOptions = {
    from: "Bookit@example.com",
    to: `${user.email}`,
    subject: "Password Reset Token Link",
    html: `<h1>Hello ${user.name}</h1><br/><p>you password reset link is http://localhost:3000/resetPassword?token=${token}. It will expire in 30mins</p>`,
  };

  transport
    .sendMail(mailOptions)
    .then((success) => {
      res.status(200).json({
        success: "true",
        message: "Password reset email sent successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      throw new ErrorHandler("Unexpected Error occured", 500);
    });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  const { password, passwordConfirm } = req.body;

  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken: encryptToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorHandler(
      "the Password token is either invalid ro expired.",
      400
    );
  }

  if (password !== passwordConfirm) {
    throw new ErrorHandler("Password and ConfirmPassword Do not match", 400);
  }

  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated SuccessFully.",
  });
});
