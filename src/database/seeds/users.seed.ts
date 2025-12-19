import { config } from 'dotenv';
import { db } from '../../config/database';
import { logger } from '../../shared/utils/logger';
import { hashPassword } from '../../shared/utils/password';
import { users } from '../schema';

config();

export async function seedUsers() {
    try {
        logger.info('Starting user seeding...');

        const seedData = [
            {
                fullName: 'Admin User',
                email: 'admin@zeniq.com',
                password: await hashPassword('Admin123'),
                role: 'admin',
            },
            {
                fullName: 'Kingkin Fajar',
                email: 'kingkin@example.com',
                password: await hashPassword('Password123'),
                role: 'student',
            },
            {
                fullName: 'Albert Einstein',
                email: 'albert@example.com',
                password: await hashPassword('Password123'),
                role: 'student',
            },
            {
                fullName: 'Bob Johnson',
                email: 'bob@example.com',
                password: await hashPassword('Password123'),
                role: 'student',
            },
            {
                fullName: 'Sarah Williams',
                email: 'sarah@example.com',
                password: await hashPassword('Password123'),
                role: 'student',
            },
        ];

        const createdUsers = [];
        for (const userData of seedData) {
            try {
                const [user] = await db.insert(users).values(userData).returning();
                createdUsers.push(user);
                logger.success(`Created user: ${userData.email} (${userData.role})`);
            } catch (error: any) {
                if (error.constraint === 'users_email_unique') {
                    logger.warn(`User ${userData.email} already exists, skipping...`);
                } else {
                    logger.error(`Failed to create user ${userData.email}:`, error);
                }
            }
        }

        logger.success('User seeding completed!');
        return createdUsers;
    } catch (error) {
        logger.error('Error seeding users:', error);
        throw error;
    }
}

// Allow running this file directly
if (require.main === module) {
    seedUsers()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
