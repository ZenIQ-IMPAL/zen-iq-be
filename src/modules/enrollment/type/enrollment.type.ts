/**
 * Input payload for enrollment
 */
export interface EnrollCourseInput {
  courseId: string;
  subscriptionPlanId?: string | null;
}

/**
 * Enrollment DB response
 * Matches enrollments table exactly
 */
export type EnrollmentStatus = "active" | "completed" | "cancelled";

export interface EnrollmentResponse {
  id: string;
  courseId: string;
  enrolledAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  image: string;
}
