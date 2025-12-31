// modules/enrollment/routes/enrollment.routes.ts
import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { authenticateToken } from "../../auth/middlewares/auth.middleware";

const router = Router();
const controller = new EnrollmentController();

router.post("/", authenticateToken, controller.enrollCourse);
router.get("/me", authenticateToken, controller.getMyEnrollments);

export { router as enrollmentRoutes };
