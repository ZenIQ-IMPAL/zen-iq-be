import { eq, sql } from 'drizzle-orm';
import { db } from '../../../config/database';
import {
    enrollments,
    courses,
    contentModules,
    courseContent,
} from '../../../database/schema';
import type { LearningProgressResponse } from '../types/learning-progress.types';

export class LearningProgressService {
    async getUserLearningProgress(
        userId: string
    ): Promise<LearningProgressResponse[]> {
        const results = await db
            .select({
                courseId: courses.id,
                title: courses.title,
                image: courses.thumbnailUrl,
                totalContent: sql<number>`COUNT(${courseContent.id})`,
                completedContent: sql<number>`
                    SUM(CASE WHEN ${courseContent.isChecked} = true THEN 1 ELSE 0 END)
                `,
            })
            .from(enrollments)
            .innerJoin(courses, eq(enrollments.courseId, courses.id))
            .innerJoin(contentModules, eq(contentModules.courseId, courses.id))
            .innerJoin(
                courseContent,
                eq(courseContent.moduleId, contentModules.id)
            )
            .where(eq(enrollments.userId, userId))
            .groupBy(courses.id);

        return results.map((row) => {
            const progress =
                row.totalContent > 0
                    ? Math.round(
                          (row.completedContent / row.totalContent) * 100
                      )
                    : 0;

            return {
                courseId: row.courseId,
                title: row.title,
                image: row.image,
                progress,
                completedContent: row.completedContent,
                totalContent: row.totalContent,
            };
        });
    }
}
