import catchAsync from "../middlewares/catchAsync";
import ErrorHandler from "../utils/ErrorHandler";
import BookingsModel from "../Models/BookingsModel";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export const getAllBookings = catchAsync(async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;

  const AllBookings = await BookingsModel.count();

  const Bookings = await BookingsModel.find({
    user: req.user.id,
  })
    .limit(limit)
    .skip(page === 1 ? 0 : page * limit - limit);

  res.status(200).json({
    success: true,
    bookings: Bookings,
    totalBookings: AllBookings,
  });
});

export const getBookingDetails = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const Booking = await BookingsModel.findById(id)
    .populate("user", "-password")
    .populate("room");

  res.status(200).json({
    success: true,
    booking: Booking,
  });
});

export const makeBooking = catchAsync(async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate, amountPaid, daysOfStay } =
    req.body;

  const Booking = await BookingsModel.create({
    room: roomId,
    user: req.user.id,
    checkInDate,
    checkOutDate,
    amountPaid,
    daysOfStay,
  });

  res.status(200).json({
    success: true,
    booking: Booking,
  });
});

export const checkBooking = catchAsync(async (req, res, next) => {
  const { checkInDate, checkOutDate, roomId } = req.query;

  const Bookings = await BookingsModel.find({
    room: roomId,
    $and: [
      {
        checkInDate: { $lte: checkOutDate },
      },
      {
        checkOutDate: { $gte: checkInDate },
      },
    ],
  });

  let isAvailaible;

  if (Bookings && Bookings.length === 0) {
    isAvailaible = true;
  } else {
    isAvailaible = false;
  }

  res.status(200).json({
    success: true,
    isAvailaible,
  });
});

export const GetAllBookedDates = catchAsync(async (req, res, next) => {
  const { roomId } = req.query;

  const Bookings = await BookingsModel.find({
    room: roomId,
  });

  let bookedDates = [];

  Bookings.forEach((el) => {
    const range = moment.range(moment(el.checkInDate), moment(el.checkOutDate));
    const dates = Array.from(range.by("day"));
    bookedDates = bookedDates.concat(dates);
  });

  res.status(200).json({
    success: true,
    bookedDates,
  });
});

// Get Admin All Bookings

export const GetAdminAllBookings = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 5, sort = "newest" } = req.query;
  const skip = page > 1 ? page * limit - limit : 0;

  const BookingCount = await BookingsModel.countDocuments();

  const Bookings = await BookingsModel.find()
    .limit(limit)
    .skip(skip)
    .sort({
      createdAt:
        sort === "newest" ? "desc" : sort === "oldest" ? "asc" : "desc",
    });

  res.status(200).json({
    Bookings,
    success: true,
    total: BookingCount,
  });
});

export const AdminDeleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  await BookingsModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Booking is Deleted SuccessFully",
  });
});
