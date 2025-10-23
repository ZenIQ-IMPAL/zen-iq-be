import { CourseWithInstructor } from '../../courses/types/course.types';

export interface RecommendedCoursesResponse {
    courses: CourseWithInstructor[];
}

export interface RecommendationFilters {
  userId: string;
  lastNSearches?: number;
}

export interface RecommendedCourse {
  course: CourseWithInstructor;
  score: number;
}