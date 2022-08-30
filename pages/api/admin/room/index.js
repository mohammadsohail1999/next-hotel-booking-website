import nc from "next-connect";
import onError from "../../../../middlewares/errors";
import { protect, userRoles } from "../../../../middlewares/auth";
import {
  deleteRoomById,
  getAllRoomsAdmin,
  newRoom,
} from "../../../../controllers/roomControllers";
import upload from "../../../../middlewares/fileUploadMiddleWare";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({ onError })
  .get(protect, userRoles("Admin"), getAllRoomsAdmin)
  .post(protect, userRoles("Admin"), upload.array("images", 4), newRoom);

export default handler;
