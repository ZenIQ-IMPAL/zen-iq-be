import { Request, Response, NextFunction } from "express";
import { EnrollmentService } from "../services/enrollment.service";
import { ApiResponse } from "../../../shared/types";
import { EnrollCourseInput } from "../type/enrollment.type";
import { logger } from "../../../shared/utils/logger";

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    this.enrollmentService = new EnrollmentService();
  }

  enrollCourse = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const body = req.body as EnrollCourseInput;

      if (!userId) {
        throw new Error("Unauthorized");
      }

      if (!body.courseId) {
        throw new Error("Course ID is required");
      }

      const enrollment = await this.enrollmentService.enrollCourse(
        userId,
        body
      );

      logger.info(`User ${userId} enrolled in course ${body.courseId}`);

      res.status(201).json({
        success: true,
        message: "Enrollment successful",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyEnrollments = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.id; // same pattern as auth

      const enrollments = await this.enrollmentService.getMyEnrollments(userId);

      res.status(200).json({
        success: true,
        message: "Enrollments retrieved successfully",
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  };
}
