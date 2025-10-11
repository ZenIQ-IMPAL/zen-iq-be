import { config } from 'dotenv';
import { db } from '../../config/database';
import { users } from '../schema';
import { hashPassword } from '../../shared/utils/password';
import { logger } from '../../shared/utils/logger';

config();

async function seedUsers() {
    try {
        logger.info('Starting user seeding...');

        const seedData = [
            {
                fullName: 'Kingkin',
                email: 'kingkin@example.com',
                password: await hashPassword('password123'),
            },
            {
                fullName: 'Albert',
                email: 'albert@example.com',
                password: await hashPassword('password123'),
            },
            {
                fullName: 'Bob',
                email: 'bob@example.com',
                password: await hashPassword('password123'),
            },
        ];

        for (const userData of seedData) {
            try {
                await db.insert(users).values(userData);
                logger.success(`Created user: ${userData.email}`);
            } catch (error: any) {
                if (error.constraint === 'users_email_unique') {
                    logger.warn(`User ${userData.email} already exists, skipping...`);
                } else {
                    logger.error(`Failed to create user ${userData.email}:`, error);
                }
            }
        }

        logger.success('User seeding completed!');
    } catch (error) {
        logger.error('Error seeding users:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seedUsers();