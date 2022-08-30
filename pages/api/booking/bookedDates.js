import nc from "next-connect";

import onError from "../../../middlewares/errors";
import { protect } from "../../../middlewares/auth";
import { GetAllBookedDates } from "../../../controllers/BookingController";

const handler = nc({ onError: onError }).get(protect, GetAllBookedDates);

export default handler;
