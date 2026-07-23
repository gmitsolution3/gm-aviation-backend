import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";

const router = Router();

router.post(
  "/",
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);

router.get("/", CourseController.getAllCourses);

router.get("/:id", CourseController.getSingleCourse);

router.patch(
  "/:id",
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);

router.delete("/:id", CourseController.deleteCourse);

export const CourseRoutes = router;