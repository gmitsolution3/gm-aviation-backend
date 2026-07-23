import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { AdmissionController } from "./admission.controller";
import { AdmissionValidation } from "./admission.validation";

const router = Router();

router.post(
  "/",
  validateRequest(
    AdmissionValidation.createAdmissionValidationSchema,
  ),
  AdmissionController.createAdmission,
);

router.get(
  "/my/:userId",
  AdmissionController.getMyAdmissions,
);

router.get(
  "/",
  AdmissionController.getAllAdmissions,
);

router.get(
  "/:id",
  AdmissionController.getSingleAdmission,
);

router.patch(
  "/:id/review",
  validateRequest(
    AdmissionValidation.reviewAdmissionValidationSchema,
  ),
  AdmissionController.reviewAdmission,
);

export const AdmissionRoutes = router;