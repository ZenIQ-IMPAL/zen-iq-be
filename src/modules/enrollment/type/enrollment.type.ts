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
export interface EnrollmentResponse {
  id: string;
  userId: string;
  courseId: string;
  subscriptionPlanId: string | null;
  enrolledAt: string;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus = "active" | "completed" | "cancelled";

export interface EnrollmentResponse {
  id: string;
  userId: string;
  courseId: string;
  subscriptionPlanId: string | null;
  enrolledAt: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
}
