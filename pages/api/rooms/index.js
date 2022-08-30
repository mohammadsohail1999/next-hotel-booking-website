import nc from "next-connect";

import { getAllRooms } from "../../../controllers/roomControllers";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";

const handler = nc({ onError });

dbConnect();

handler.get(getAllRooms);

// handler.post(newRoom);

export default handler;
