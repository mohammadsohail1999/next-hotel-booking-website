import nc from "next-connect";
import onError from "../../../middlewares/errors";
import { protect, userRoles } from "../../../middlewares/auth";
import { imageDeleteController } from "../../../controllers/imageController";

const handler = nc({ onError }).patch(
  protect,
  userRoles("Admin"),
  imageDeleteController
);

export default handler;
