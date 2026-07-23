import { Router } from "express";

import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getUsers);

router.get("/:id", UserController.getUser);

router.patch(
  "/:id/role",
  validateRequest(
    UserValidation.updateUserRoleValidationSchema,
  ),
  UserController.updateUserRole,
);

export const UserRoutes = router;