import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Room name"],
      trim: true,
      maxlength: [100, "not more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter price"],
      trim: true,
      maxlength: [4, "not more than 4 digit"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Room desc."],
    },
    address: {
      type: String,
      required: [true, "Please Enter Room address."],
    },
    guestCapacity: {
      type: Number,
      required: [true, "Please Enter number of guests."],
      default: 1,
    },
    numOfBeds: {
      type: Number,
      required: [true, "pleasae enter number of beds"],
      default: 1,
    },
    internet: {
      type: Boolean,
      default: false,
    },
    breakFast: {
      type: Boolean,
      default: false,
    },
    airConditioned: {
      type: Boolean,
      default: false,
    },
    petsAllowed: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "not less than 0"],
      max: [5, "not more than 5"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please Enter the Category"],
      enum: {
        values: ["King", "Single", "Twins"],
        message: "Please Select correct category for room",
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
