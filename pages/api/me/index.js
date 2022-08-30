import nc from "next-connect";
import { updateUser } from "../../../controllers/userController";
import { currentUser } from "../../../controllers/AuthController";
import { protect } from "../../../middlewares/auth";
import onError from "../../../middlewares/errors";
import dbConnect from "../../../config/dbConnect";

dbConnect();

const handler = nc({ onError: onError })
  .use(protect)
  .get(currentUser)
  .put(updateUser);

export default handler;
