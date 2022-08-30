import nc from "next-connect";
import {
  AdminDeleteBooking,
  GetAdminAllBookings,
} from "../../../../controllers/BookingController";
import { protect, userRoles } from "../../../../middlewares/auth";
import onError from "../../../../middlewares/errors";

const handler = nc({ onError })
  .get(protect, userRoles("Admin"), GetAdminAllBookings)
  .delete(protect, userRoles("Admin"), AdminDeleteBooking);

export default handler;
