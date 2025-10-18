import { config } from 'dotenv';
import { db } from '../../config/database';
import { testimonials, users } from '../schema';
import { logger } from '../../shared/utils/logger';

config();

export async function seedTestimonials() {
    try {
        logger.info('Starting testimonials seeding...');
        
        const allUsers = await db.select().from(users);

        if (allUsers.length === 0) {
            logger.warn('No users found. Please seed users first.');
            return [];
        }

        const testimonialsData = [
            {
                userId: allUsers[0]?.id,
                testimonialText: 'This platform has completely transformed my career! The courses are well-structured and the instructors are amazing. I landed my dream job as a Full Stack Developer within 3 months of completing the bootcamp.',
                rating: 5,
                isFeatured: true,
            },
            {
                userId: allUsers[1]?.id,
                testimonialText: 'Best investment I\'ve ever made in my education. The hands-on projects and real-world examples made learning so much easier. Highly recommend to anyone looking to upskill!',
                rating: 5,
                isFeatured: true,
            },
            {
                userId: allUsers[2]?.id,
                testimonialText: 'Great content and excellent support from the instructors. The only downside is that I wish there were more advanced courses available.',
                rating: 4,
                isFeatured: false,
            },
            {
                userId: allUsers[0]?.id,
                testimonialText: 'The Machine Learning course was exceptional! The instructor explained complex concepts in a very simple and understandable way. Can\'t wait to apply what I learned in my work.',
                rating: 5,
                isFeatured: true,
            },
            {
                userId: allUsers[1]?.id,
                testimonialText: 'Good courses overall. The video quality is excellent and the platform is easy to navigate. Would love to see more interactive coding exercises though.',
                rating: 4,
                isFeatured: false,
            },
            {
                userId: allUsers[2]?.id,
                testimonialText: 'As a complete beginner, I was worried about keeping up, but the courses are so well-paced and beginner-friendly. I\'ve learned so much in just a few weeks!',
                rating: 5,
                isFeatured: false,
            },
        ];

        const createdTestimonials = [];
        for (const testimonialData of testimonialsData) {
            if (!testimonialData.userId) continue;

            try {
                const [testimonial] = await db.insert(testimonials).values({
                    ...testimonialData,
                    userId: testimonialData.userId as string,
                }).returning();
                createdTestimonials.push(testimonial);
                logger.success(`Created testimonial with rating ${testimonialData.rating}`);
            } catch (error: any) {
                logger.error(`Failed to create testimonial:`, error);
            }
        }

        logger.success('Testimonials seeding completed!');
        return createdTestimonials;
    } catch (error) {
        logger.error('Error seeding testimonials:', error);
        throw error;
    }
}
