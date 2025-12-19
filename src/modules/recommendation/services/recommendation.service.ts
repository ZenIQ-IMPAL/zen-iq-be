import cosineSimilarity from 'compute-cosine-similarity';
import { desc, eq } from 'drizzle-orm';
import natural from 'natural';
import { db } from '../../../config/database';
import { searchHistory } from '../../../database/schema';
import { CourseService } from '../../courses/services/course.service';
import type { CourseWithInstructor } from '../../courses/types/course.types';
import type { RecommendationFilters, RecommendedCourse } from '../types/recommendation.types';

export class RecommendationService {
    private courseService: CourseService;

    constructor() {
        this.courseService = new CourseService();
    }

    async getRecommendedCourses({
        userId,
        lastNSearches = 5,
    }: RecommendationFilters): Promise<CourseWithInstructor[]> {
        // Fetch last N searches
        const searchResult = await db
            .select({ query: searchHistory.query })
            .from(searchHistory)
            .where(eq(searchHistory.userId, userId))
            .orderBy(desc(searchHistory.createdAt))
            .limit(lastNSearches);

        if (searchResult.length === 0) return [];

        const searchQueries = searchResult.map((r) => r.query);

        // Fetch all courses
        const allCoursesResult = await this.courseService.getCourses({ page: 1, limit: 1000 });
        const allCourses = allCoursesResult.courses;

        if (allCourses.length === 0) return [];

        // TF-IDF + cosine similarity
        const tfidf = new natural.TfIdf();
        allCourses.forEach((course) => tfidf.addDocument(`${course.title} ${course.description}`));

        const combinedQuery = searchQueries.join(' ');
        const queryVector: number[] = [];
        tfidf.tfidfs(combinedQuery, (i, measure) => (queryVector[i] = measure));

        const scoredCourses: RecommendedCourse[] = allCourses.map((course, i) => {
            const courseVector: number[] = tfidf.listTerms(i).map((term) => term.tfidf);

            // Pad vectors to equal length to avoid cosine-similarity errors
            const maxLength = Math.max(queryVector.length, courseVector.length);
            const paddedQueryVector = [
                ...queryVector,
                ...Array(maxLength - queryVector.length).fill(0),
            ];
            const paddedCourseVector = [
                ...courseVector,
                ...Array(maxLength - courseVector.length).fill(0),
            ];

            const score = cosineSimilarity(paddedQueryVector, paddedCourseVector) || 0;
            return { course, score };
        });

        // Return top 3 recommended courses
        return scoredCourses
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((x) => x.course);
    }
}
