import catchAsync from "../middlewares/catchAsync";
import ErrorHandler from "../middlewares/errors";
import UserModel from "../Models/UserModel";
import { v2 } from "cloudinary";

v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { name, email, password, image } = req.body;

  const user = await UserModel.findById(req.user.id);

  if (user) {
    user.name = name;
    user.email = email;

    if (password) {
      user.password = password;
    }
    if (image) {
      const result = await v2.uploader.destroy(user.avatar.public_id);
      console.log(result, "deleted");

      const newimage = await v2.uploader.upload(image, {
        folder: "Bookit",
        transformation: [{ width: 150, height: 150 }],
      });

      user.avatar = {
        public_id: newimage.public_id,
        url: newimage.secure_url,
      };
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User Updated SuccessFully",
  });
});

export const AdminGetUser = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 5, sort = "newest", search = "" } = req.query;

  const skip = page === 1 ? 0 : page * limit - limit;

  let userCount;

  let users;
  let query;

  if (search) {
    query = UserModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        {
          email: { $regex: search, $options: "i" },
        },
      ],
    })
      .limit(limit)
      .skip(skip)
      .sort(sort === "newest" ? "-createdAt" : "createdAt");

    users = await query;
    userCount = await UserModel.countDocuments({
      $or: [
        { name: { $regex: search, $options: "i" } },
        {
          email: { $regex: search, $options: "i" },
        },
      ],
    });
  } else {
    query = UserModel.find({})
      .limit(limit)
      .skip(skip)
      .sort(sort === "newest" ? "-createdAt" : "createdAt");

    users = await query;
    userCount = await UserModel.countDocuments();
  }

  res.status(200).json({
    success: true,
    users,
    total: userCount,
  });
});

export const AdminGetUserById = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const user = await UserModel.findById(id).select("-password");

  res.status(200).json({
    success: true,
    user,
  });
});

export const AdminUpdateUser = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const { name, email, role } = req.body;

  await UserModel.findByIdAndUpdate(
    id,
    {
      name,
      email,
      role,
    },
    { runValidators: true }
  );
  res.status(200).json({
    success: true,
    message: "user is updated  successfully",
  });
});
