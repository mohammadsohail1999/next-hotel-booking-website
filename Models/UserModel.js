import Mongoose from "mongoose";
import validator from "validator";
import { compareHash, genHash, getResetToken } from "../utils/funcs";
import crypto from "crypto";
import cryptoJS from "crypto-js";

const UserSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is Required"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      min: [6, "min 6 characters are required"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "invalid Email"],
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  try {
    this.password = await genHash(this.password);
    next();
  } catch (error) {
    throw new Error(error);
  }
});

UserSchema.methods.comparePasswords = async function (inputPass) {
  try {
    const res = await compareHash(inputPass, this.password);
    return res;
  } catch (error) {
    return false;
  }
};

UserSchema.methods.getResetPasswordToken = async function () {
  const { token, encryptToken } = await getResetToken();

  this.resetPasswordToken = encryptToken;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  await this.save();

  return token;
};

export default Mongoose.models.User || Mongoose.model("User", UserSchema);
