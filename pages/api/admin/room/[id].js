import nc from "next-connect";
import onError from "../../../../middlewares/errors";
import { protect, userRoles } from "../../../../middlewares/auth";
import {
  deleteRoomById,
  getRoomById,
  updateRoomById,
} from "../../../../controllers/roomControllers";
import upload from "../../../../middlewares/fileUploadMiddleWare";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({ onError })
  .get(protect, userRoles("Admin"), getRoomById)
  .delete(protect, userRoles("Admin"), deleteRoomById)
  .put(protect, userRoles("Admin"), upload.array("images", 4), updateRoomById);

export default handler;
