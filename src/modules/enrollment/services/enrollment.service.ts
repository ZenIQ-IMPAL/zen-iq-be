import { db } from "../../../config/database";
import { enrollments } from "../../../database/schema";
import { eq, and } from "drizzle-orm";
import { EnrollCourseInput, EnrollmentResponse } from "../type/enrollment.type";
import { AppError } from "../../../shared/middleware/error-handler";

export class EnrollmentService {
  async enrollCourse(
    userId: string,
    input: EnrollCourseInput
  ): Promise<EnrollmentResponse> {
    const { courseId, subscriptionPlanId } = input;

    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    // Check existing enrollment (idempotent)
    const existing = await db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
      )
      .limit(1);

    if (existing.length > 0) {
      return this.mapEnrollment(existing[0]!);
    }

    // Insert enrollment
    const inserted = await db
      .insert(enrollments)
      .values({
        userId,
        courseId,
        subscriptionPlanId: subscriptionPlanId ?? null,
      })
      .returning();

    if (!inserted || inserted.length === 0) {
      throw new AppError("Failed to enroll in course", 500);
    }

    return this.mapEnrollment(inserted[0]!);
  }

  private mapEnrollment(row: any): EnrollmentResponse {
    return {
      id: row.id,
      userId: row.userId,
      courseId: row.courseId,
      subscriptionPlanId: row.subscriptionPlanId,
      enrolledAt: row.enrolledAt.toISOString(),
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async getMyEnrollments(userId: string): Promise<EnrollmentResponse[]> {
    const rows = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    return rows.map((row) => this.mapEnrollment(row));
  }
}
