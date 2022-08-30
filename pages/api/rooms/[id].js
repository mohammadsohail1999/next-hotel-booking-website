import nc from "next-connect";
import {
  deleteRoomById,
  getRoomById,
  updateRoomById,
} from "../../../controllers/roomControllers";
import onError from "../../../middlewares/errors";

const handler = nc({ onError });

handler.get(getRoomById);

handler.put(updateRoomById);

handler.delete(deleteRoomById);

export default handler;
