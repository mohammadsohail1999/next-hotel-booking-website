import nc from "next-connect";
import { stripeCheckout } from "../../../controllers/stripeController";
import onError from "../../../middlewares/errors";

const handler = nc({ onError }).post(stripeCheckout);

export default handler;
