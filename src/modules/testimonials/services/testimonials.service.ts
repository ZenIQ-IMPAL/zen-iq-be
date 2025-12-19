import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '../../../config/database';
import { testimonials, users } from '../../../database/schema';
import type {
    TestimonialsFilters,
    TestimonialsListResponse,
    TestimonialWithUser,
} from '../types/testimonials.types';

export class TestimonialsService {
    async getTestimonials(filters: TestimonialsFilters): Promise<TestimonialsListResponse> {
        const conditions = this.buildWhereConditions(filters);
        const offset = (filters.page - 1) * filters.limit;

        const [totalResult, testimonialsData] = await Promise.all([
            this.getTotal(conditions),
            this.getTestimonialsData(conditions, filters.limit, offset),
        ]);

        const totalPages = Math.ceil(totalResult / filters.limit);

        return {
            testimonials: testimonialsData,
            pagination: {
                page: filters.page,
                limit: filters.limit,
                total: totalResult,
                totalPages,
            },
        };
    }

    private buildWhereConditions(filters: TestimonialsFilters) {
        const conditions = [];

        const featuredCondition = filters.isFeatured
            ? eq(testimonials.isFeatured, true)
            : undefined;

        featuredCondition && conditions.push(featuredCondition);

        return conditions.length > 0 ? and(...conditions) : undefined;
    }

    private async getTotal(conditions: ReturnType<typeof and>) {
        const [result] = await db.select({ count: count() }).from(testimonials).where(conditions);

        return result?.count ?? 0;
    }

    private async getTestimonialsData(
        conditions: ReturnType<typeof and>,
        limit: number,
        offset: number
    ): Promise<TestimonialWithUser[]> {
        const results = await db
            .select({
                id: testimonials.id,
                userId: testimonials.userId,
                testimonialText: testimonials.testimonialText,
                rating: testimonials.rating,
                isFeatured: testimonials.isFeatured,
                createdAt: testimonials.createdAt,
                updatedAt: testimonials.updatedAt,
                user: {
                    id: users.id,
                    fullName: users.fullName,
                    email: users.email,
                },
            })
            .from(testimonials)
            .innerJoin(users, eq(testimonials.userId, users.id))
            .where(conditions)
            .orderBy(desc(testimonials.createdAt))
            .limit(limit)
            .offset(offset);

        return results;
    }
}
