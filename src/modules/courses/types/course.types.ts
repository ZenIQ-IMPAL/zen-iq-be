import { Course } from '../../../database/schema';

export interface CourseFilters {
    category?: string;
    isFree?: boolean;
    difficultyLevel?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CourseWithInstructor extends Course {
    instructor: {
        id: string;
        name: string;
        avatarUrl: string | null;
    };
}

export interface CourseListResponse {
    courses: CourseWithInstructor[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CourseDetailResponse extends Course {
    instructor: {
        id: string;
        name: string;
        email: string;
        bio: string | null;
        avatarUrl: string | null;
    };
    modules: Array<{
        id: string;
        moduleName: string;
        moduleDescription: string | null;
        orderSequence: number;
        content: Array<{
            id: string;
            contentTitle: string;
            contentDescription: string | null;
            videoUrl: string | null;
            orderSequence: number;
        }>;
    }>;
    totalModules: number;
    totalContent: number;
}
