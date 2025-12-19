import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../../../config/database';
import { contentModules, courseContent, courses, instructors } from '../../../database/schema';
import { AppError } from '../../../shared/middleware/error-handler';
import type {
    CourseDetailResponse,
    CourseFilters,
    CourseListResponse,
} from '../types/course.types';

export class CourseService {
    async getCourses(filters: CourseFilters): Promise<CourseListResponse> {
        const { category, isFree, difficultyLevel, search, page = 1, limit = 10 } = filters;

        const conditions = [];

        if (category) {
            conditions.push(eq(courses.category, category));
        }

        if (typeof isFree === 'boolean') {
            conditions.push(eq(courses.isFree, isFree));
        }

        if (difficultyLevel) {
            conditions.push(eq(courses.difficultyLevel, difficultyLevel));
        }

        if (search) {
            conditions.push(ilike(courses.title, `%${search}%`));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(courses)
            .where(whereClause);

        const total = Number(countResult[0]?.count || 0);

        const offset = (page - 1) * limit;
        const coursesList = await db
            .select({
                id: courses.id,
                title: courses.title,
                description: courses.description,
                thumbnailUrl: courses.thumbnailUrl,
                category: courses.category,
                isFree: courses.isFree,
                difficultyLevel: courses.difficultyLevel,
                createdAt: courses.createdAt,
                updatedAt: courses.updatedAt,
                instructorId: courses.instructorId,
                instructor: {
                    id: instructors.id,
                    name: instructors.name,
                    avatarUrl: instructors.avatarUrl,
                },
            })
            .from(courses)
            .innerJoin(instructors, eq(courses.instructorId, instructors.id))
            .where(whereClause)
            .orderBy(desc(courses.createdAt))
            .limit(limit)
            .offset(offset);

        const totalPages = Math.ceil(total / limit);

        return {
            courses: coursesList,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }

    async getCourseById(id: string): Promise<CourseDetailResponse> {
        const course = await db
            .select({
                id: courses.id,
                title: courses.title,
                description: courses.description,
                thumbnailUrl: courses.thumbnailUrl,
                category: courses.category,
                isFree: courses.isFree,
                difficultyLevel: courses.difficultyLevel,
                createdAt: courses.createdAt,
                updatedAt: courses.updatedAt,
                instructorId: courses.instructorId,
                instructor: {
                    id: instructors.id,
                    name: instructors.name,
                    email: instructors.email,
                    bio: instructors.bio,
                    avatarUrl: instructors.avatarUrl,
                },
            })
            .from(courses)
            .innerJoin(instructors, eq(courses.instructorId, instructors.id))
            .where(eq(courses.id, id))
            .limit(1);

        if (!course || course.length === 0) {
            throw new AppError('Course not found', 404);
        }

        const courseData = course[0]!;

        const modules = await db
            .select()
            .from(contentModules)
            .where(eq(contentModules.courseId, id))
            .orderBy(contentModules.orderSequence);

        const modulesWithContent = await Promise.all(
            modules.map(async (module) => {
                const content = await db
                    .select({
                        id: courseContent.id,
                        contentTitle: courseContent.contentTitle,
                        contentDescription: courseContent.contentDescription,
                        videoUrl: courseContent.videoUrl,
                        orderSequence: courseContent.orderSequence,
                    })
                    .from(courseContent)
                    .where(eq(courseContent.moduleId, module.id))
                    .orderBy(courseContent.orderSequence);

                return {
                    id: module.id,
                    moduleName: module.moduleName,
                    moduleDescription: module.moduleDescription,
                    orderSequence: module.orderSequence,
                    content,
                };
            })
        );

        const totalContent = modulesWithContent.reduce(
            (sum, module) => sum + module.content.length,
            0
        );

        return {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            thumbnailUrl: courseData.thumbnailUrl,
            category: courseData.category,
            isFree: courseData.isFree,
            difficultyLevel: courseData.difficultyLevel,
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
            instructorId: courseData.instructorId,
            instructor: courseData.instructor,
            modules: modulesWithContent,
            totalModules: modules.length,
            totalContent,
        };
    }
}
