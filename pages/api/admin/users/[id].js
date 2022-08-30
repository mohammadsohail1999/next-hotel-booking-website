import nc from "next-connect";
import onError from "../../../../middlewares/errors";
import { protect, userRoles } from "../../../../middlewares/auth";
import {
  AdminGetUserById,
  AdminUpdateUser,
} from "../../../../controllers/userController";

export default nc({ onError })
  .get(protect, userRoles("Admin"), AdminGetUserById)
  .put(protect, userRoles("Admin"), AdminUpdateUser);
