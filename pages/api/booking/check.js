import nc from "next-connect";
import { checkBooking } from "../../../controllers/BookingController";
import { protect } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";

const handler = nc({ onError: onError }).get(protect, checkBooking);

export default handler;
