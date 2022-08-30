import nc from "next-connect";
import onError from "../../../middlewares/errors";
import { getBookingDetails } from "../../../controllers/BookingController";
import { protect } from "../../../middlewares/auth";

const handler = nc({ onError: onError }).get(protect, getBookingDetails);

export default handler;
