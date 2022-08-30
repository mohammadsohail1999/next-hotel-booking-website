import nc from "next-connect";
import { webHookHandler } from "../../../controllers/stripeController";
import onError from "../../../middlewares/errors";
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({ onError }).post(webHookHandler);

export default handler;
