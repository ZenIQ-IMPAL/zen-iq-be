export interface LearningProgressResponse {
    courseId: string;
    title: string;
    image: string | null;
    progress: number;
    completedContent: number;
    totalContent: number;
}
