import nc from "next-connect";
import OnError from "../../../middlewares/errors";
import { forgotPassword } from "../../../controllers/AuthController";

const handler = nc({ onError: OnError }).post(forgotPassword);

export default handler;
