import { eq, sql } from 'drizzle-orm';
import { db } from '../../../config/database';
import { courseContent } from '../../../database/schema';

export class CourseContentService {
    /**
     * Update the isChecked field for a course content item
     * @param id - course_content.id (UUID)
     * @param isChecked - boolean value
     */
    async updateIsChecked(id: string, isChecked: boolean) {
        const result = await db
            .update(courseContent)
            .set({ isChecked })
            .where(eq(courseContent.id, sql`${id}::uuid`))
            .returning({
                id: courseContent.id,
                isChecked: courseContent.isChecked,
            });

        if (!result || result.length === 0) {
            throw new Error('Resource not found');
        }

        return result[0];
    }
}
