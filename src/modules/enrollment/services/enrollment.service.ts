import { db } from "../../../config/database";
import { enrollments, courses } from "../../../database/schema";
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
      id: row.enrollment_id,
      courseId: row.course_id,
      enrolledAt: row.enrolled_at,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      title: row.title,
      image: row.image,
    };
  }

  async getMyEnrollments(userId: string): Promise<EnrollmentResponse[]> {
    // Join enrollments with courses to get title and thumbnail_url
    const rows = await db
      .select({
        enrollment_id: enrollments.id,
        course_id: enrollments.courseId,
        enrolled_at: enrollments.enrolledAt,
        status: enrollments.status,
        created_at: enrollments.createdAt,
        updated_at: enrollments.updatedAt,
        title: courses.title,
        image: courses.thumbnailUrl,
      })
      .from(enrollments)
      .leftJoin(courses, eq(courses.id, enrollments.courseId))
      .where(eq(enrollments.userId, userId));

    return rows.map((row) => this.mapEnrollment(row));
  }
}
