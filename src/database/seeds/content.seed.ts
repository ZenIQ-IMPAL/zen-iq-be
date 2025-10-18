import { config } from 'dotenv';
import { db } from '../../config/database';
import { contentModules, courseContent, courses } from '../schema';
import { logger } from '../../shared/utils/logger';

config();

export async function seedContent() {
    try {
        logger.info('Starting content seeding...');

        const allCourses = await db.select().from(courses);

        if (allCourses.length === 0) {
            logger.warn('No courses found. Please seed courses first.');
            return { modules: [], content: [] };
        }

        const firstCourse = allCourses[0]!;

        const modulesData = [
            {
                courseId: firstCourse.id,
                moduleName: 'Introduction to Web Development',
                moduleDescription: 'Get started with the basics of web development, understanding how the web works.',
                orderSequence: 1,
            },
            {
                courseId: firstCourse.id,
                moduleName: 'HTML Fundamentals',
                moduleDescription: 'Learn HTML tags, elements, and structure to build web pages.',
                orderSequence: 2,
            },
            {
                courseId: firstCourse.id,
                moduleName: 'CSS Styling',
                moduleDescription: 'Master CSS to style your web pages and make them beautiful.',
                orderSequence: 3,
            },
            {
                courseId: firstCourse.id,
                moduleName: 'JavaScript Basics',
                moduleDescription: 'Introduction to JavaScript programming and DOM manipulation.',
                orderSequence: 4,
            },
            {
                courseId: firstCourse.id,
                moduleName: 'Building Your First Project',
                moduleDescription: 'Apply what you learned to build a complete website.',
                orderSequence: 5,
            },
        ];

        const createdModules = [];
        for (const moduleData of modulesData) {
            try {
                const [module] = await db.insert(contentModules).values(moduleData).returning();
                createdModules.push(module);
                logger.success(`Created module: ${moduleData.moduleName}`);
            } catch (error: any) {
                logger.error(`Failed to create module ${moduleData.moduleName}:`, error);
            }
        }

        const generateContentForModule = (module: any, courseId: string) => {
            const contentMap: Record<number, any[]> = {
                1: [
                    {
                        courseId,
                        moduleId: module.id,
                        contentTitle: 'Welcome to the Course',
                        contentDescription: 'Introduction video and course overview',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        textContent: 'Welcome to the Complete Web Development Bootcamp! In this course, you will learn...',
                        orderSequence: 1,
                    },
                    {
                        courseId,
                        moduleId: module.id,
                        contentTitle: 'How the Web Works',
                        contentDescription: 'Understanding client-server architecture',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        textContent: 'The web operates on a client-server model...',
                        orderSequence: 2,
                    },
                    {
                        courseId,
                        moduleId: module.id,
                        contentTitle: 'Setting Up Your Development Environment',
                        contentDescription: 'Install necessary tools and editors',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        textContent: 'You will need to install Visual Studio Code, Node.js, and Git...',
                        orderSequence: 3,
                    }
                ],
                2: [
                    {
                        courseId,
                        moduleId: module.id,
                        contentTitle: 'HTML Introduction',
                        contentDescription: 'What is HTML and why do we need it?',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        textContent: 'HTML stands for HyperText Markup Language...',
                        orderSequence: 1,
                    },
                    {
                        courseId,
                        moduleId: module.id,
                        contentTitle: 'HTML Tags and Elements',
                        contentDescription: 'Learn about common HTML tags',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        textContent: 'HTML tags include <div>, <p>, <h1>, <a>, and many more...',
                        orderSequence: 2,
                    },
                    {
                        courseId,
                        moduleId: module.id,
                        contentTitle: 'Building Your First HTML Page',
                        contentDescription: 'Hands-on exercise creating an HTML page',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        textContent: 'Let\'s create a simple HTML page with a header, paragraph, and link...',
                        orderSequence: 3,
                    }
                ]
            };

            return contentMap[module.orderSequence] || [
                {
                    courseId,
                    moduleId: module.id,
                    contentTitle: `${module.moduleName} - Lesson 1`,
                    contentDescription: 'Introduction to this module',
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    textContent: `This is the first lesson of ${module.moduleName}...`,
                    orderSequence: 1,
                },
                {
                    courseId,
                    moduleId: module.id,
                    contentTitle: `${module.moduleName} - Lesson 2`,
                    contentDescription: 'Deep dive into the concepts',
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    textContent: `In this lesson, we will explore the core concepts...`,
                    orderSequence: 2,
                }
            ];
        };

        // Generate content data using the helper function
        const contentData = createdModules.flatMap(module =>
            generateContentForModule(module!, firstCourse.id)
        );

        const createdContent = [];
        for (const content of contentData) {
            try {
                const [newContent] = await db.insert(courseContent).values(content).returning();
                createdContent.push(newContent);
                logger.success(`Created content: ${content.contentTitle}`);
            } catch (error: any) {
                logger.error(`Failed to create content ${content.contentTitle}:`, error);
            }
        }

        logger.success('Content seeding completed!');
        return { modules: createdModules, content: createdContent };
    } catch (error) {
        logger.error('Error seeding content:', error);
        throw error;
    }
}
