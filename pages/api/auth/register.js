import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import { registerUser } from "../../../controllers/AuthController";
import onError from "../../../middlewares/errors";
dbConnect();

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const handler = nc({ onError }).post(registerUser);

export default handler;
