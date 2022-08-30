import nc from "next-connect";
import {
  getAllBookings,
  makeBooking,
} from "../../../controllers/BookingController";
import { protect } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";

const handler = nc({ onError: onError })
  .get(protect, getAllBookings)
  .post(protect, makeBooking);

export default handler;
