import { config } from 'dotenv';
import { logger } from '../../shared/utils/logger';
import { seedContent } from './content.seed';
import { seedCourses } from './courses.seed';
import { seedInstructors } from './instructors.seed';
import { seedSubscriptionPlans } from './subscription-plans.seed';
import { seedTestimonials } from './testimonials.seed';
import { seedUsers } from './users.seed';

config();

async function seedAll() {
    try {
        logger.info('====================================');
        logger.info('Starting database seeding process...');
        logger.info('====================================\n');

        logger.info('1/6 Seeding users...');
        await seedUsers();

        logger.info('\n2/6 Seeding instructors...');
        await seedInstructors();

        logger.info('\n3/6 Seeding subscription plans...');
        await seedSubscriptionPlans();

        logger.info('\n4/6 Seeding courses...');
        await seedCourses();

        logger.info('\n5/6 Seeding content (modules and course content)...');
        await seedContent();

        logger.info('\n6/6 Seeding testimonials...');
        await seedTestimonials();

        logger.info('\n====================================');
        logger.success('All seeding completed successfully!');
        logger.info('====================================');
        logger.info('\nNote: Enrollments and payments not seeded.');
        logger.info('You can test these features manually later.');
    } catch (error) {
        logger.error('\n====================================');
        logger.error('Seeding failed with error:', error);
        logger.error('====================================');
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seedAll();
