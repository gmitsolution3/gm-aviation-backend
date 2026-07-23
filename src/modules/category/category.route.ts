import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory,
);

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getSingleCategory);

router.patch(
  "/:id",
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory,
);

router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;