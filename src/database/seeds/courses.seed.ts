import { config } from 'dotenv';
import { db } from '../../config/database';
import { courses, instructors } from '../schema';
import { logger } from '../../shared/utils/logger';

config();

export async function seedCourses() {
    try {
        logger.info('Starting courses seeding...');

        const allInstructors = await db.select().from(instructors);

        if (allInstructors.length === 0) {
            logger.warn('No instructors found. Please seed instructors first.');
            return [];
        }

        const coursesData = [
            {
                title: 'Complete Web Development Bootcamp',
                description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch. Build real-world projects and become a full-stack web developer.',
                thumbnailUrl: 'https://picsum.photos/seed/course1/400/300',
                instructorId: allInstructors[0]?.id,
                category: 'Web Development',
                isFree: false,
                difficultyLevel: 'Beginner',
            },
            {
                title: 'Advanced React with TypeScript',
                description: 'Master React hooks, context, Redux, and TypeScript. Learn best practices for building scalable enterprise applications.',
                thumbnailUrl: 'https://picsum.photos/seed/course2/400/300',
                instructorId: allInstructors[1]?.id,
                category: 'Web Development',
                isFree: false,
                difficultyLevel: 'Advanced',
            },
            {
                title: 'Introduction to Programming with Python',
                description: 'Start your programming journey with Python. Perfect for beginners who want to learn coding fundamentals.',
                thumbnailUrl: 'https://picsum.photos/seed/course3/400/300',
                instructorId: allInstructors[2]?.id,
                category: 'Programming',
                isFree: true,
                difficultyLevel: 'Beginner',
            },
            {
                title: 'Machine Learning A-Z',
                description: 'Comprehensive course covering supervised and unsupervised learning, neural networks, and deep learning with TensorFlow and PyTorch.',
                thumbnailUrl: 'https://picsum.photos/seed/course4/400/300',
                instructorId: allInstructors[2]?.id,
                category: 'Data Science',
                isFree: false,
                difficultyLevel: 'Intermediate',
            },
            {
                title: 'Flutter & Dart - Complete Guide',
                description: 'Build beautiful native mobile apps for iOS and Android using Flutter and Dart. Includes Firebase integration.',
                thumbnailUrl: 'https://picsum.photos/seed/course5/400/300',
                instructorId: allInstructors[3]?.id,
                category: 'Mobile Development',
                isFree: false,
                difficultyLevel: 'Intermediate',
            },
            {
                title: 'AWS Certified Solutions Architect',
                description: 'Prepare for AWS certification while learning cloud architecture, deployment, and management best practices.',
                thumbnailUrl: 'https://picsum.photos/seed/course6/400/300',
                instructorId: allInstructors[4]?.id,
                category: 'Cloud Computing',
                isFree: false,
                difficultyLevel: 'Advanced',
            },
            {
                title: 'UI/UX Design Fundamentals',
                description: 'Learn the principles of user interface and user experience design. Master Figma and Adobe XD.',
                thumbnailUrl: 'https://picsum.photos/seed/course7/400/300',
                instructorId: allInstructors[1]?.id,
                category: 'Design',
                isFree: true,
                difficultyLevel: 'Beginner',
            },
            {
                title: 'DevOps with Docker and Kubernetes',
                description: 'Master containerization and orchestration. Learn CI/CD pipelines, monitoring, and cloud deployment.',
                thumbnailUrl: 'https://picsum.photos/seed/course8/400/300',
                instructorId: allInstructors[4]?.id,
                category: 'DevOps',
                isFree: false,
                difficultyLevel: 'Advanced',
            },
            {
                title: 'JavaScript ES6+ Masterclass',
                description: 'Deep dive into modern JavaScript features, async programming, and best practices.',
                thumbnailUrl: 'https://picsum.photos/seed/course9/400/300',
                instructorId: allInstructors[0]?.id,
                category: 'Programming',
                isFree: true,
                difficultyLevel: 'Intermediate',
            },
            {
                title: 'Data Structures and Algorithms',
                description: 'Master essential data structures and algorithms. Prepare for technical interviews at top tech companies.',
                thumbnailUrl: 'https://picsum.photos/seed/course10/400/300',
                instructorId: allInstructors[2]?.id,
                category: 'Computer Science',
                isFree: false,
                difficultyLevel: 'Intermediate',
            },
        ];

        const createdCourses = [];
        for (const courseData of coursesData) {
            if (!courseData.instructorId) {
                logger.warn(`Skipping course ${courseData.title}: instructor not found`);
                continue;
            }

            try {
                const [course] = await db.insert(courses).values({
                    ...courseData,
                    instructorId: courseData.instructorId as string,
                }).returning();
                createdCourses.push(course);
                logger.success(`Created course: ${courseData.title}`);
            } catch (error: any) {
                logger.error(`Failed to create course ${courseData.title}:`, error);
            }
        }

        logger.success('Courses seeding completed!');
        return createdCourses;
    } catch (error) {
        logger.error('Error seeding courses:', error);
        throw error;
    }
}
