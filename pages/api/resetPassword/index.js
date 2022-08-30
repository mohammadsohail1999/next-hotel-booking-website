import nc from "next-connect";
import { resetPassword } from "../../../controllers/AuthController";
import onError from "../../../middlewares/errors";

const handler = nc({ onError: onError }).post(resetPassword);

export default handler;
