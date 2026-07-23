import { Router } from "express";
import { AdmissionRoutes } from "../modules/admission/admission.route";
import { CourseRoutes } from "../modules/course/course.route";
import { CategoryRoutes } from "./../modules/category/category.route";

const router = Router();

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/admissions",
    route: AdmissionRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
