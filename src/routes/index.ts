import { Router } from "express";
import { CategoryRoutes } from './../modules/category/category.route';
import { CourseRoutes } from "../modules/course/course.route";

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
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
