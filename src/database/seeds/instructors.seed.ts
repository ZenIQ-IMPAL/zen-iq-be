import { config } from 'dotenv';
import { db } from '../../config/database';
import { logger } from '../../shared/utils/logger';
import { instructors } from '../schema';

config();

export async function seedInstructors() {
    try {
        logger.info('Starting instructors seeding...');

        const instructorsData = [
            {
                name: 'Dr. Ahmad Fauzi',
                email: 'ahmad.fauzi@zeniq.com',
                bio: 'Expert in Web Development with 15+ years of experience. Passionate about teaching modern JavaScript frameworks and best practices.',
                avatarUrl: 'https://i.pravatar.cc/150?img=12',
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@zeniq.com',
                bio: 'Full Stack Developer and UI/UX enthusiast. Specializes in React, Node.js, and cloud architecture.',
                avatarUrl: 'https://i.pravatar.cc/150?img=45',
            },
            {
                name: 'Budi Santoso',
                email: 'budi.santoso@zeniq.com',
                bio: 'Data Science and Machine Learning instructor. Former Google engineer with expertise in Python and TensorFlow.',
                avatarUrl: 'https://i.pravatar.cc/150?img=33',
            },
            {
                name: 'Emily Chen',
                email: 'emily.chen@zeniq.com',
                bio: 'Mobile app developer specializing in Flutter and React Native. Published 20+ apps on both iOS and Android.',
                avatarUrl: 'https://i.pravatar.cc/150?img=28',
            },
            {
                name: 'Michael Rodriguez',
                email: 'michael.rodriguez@zeniq.com',
                bio: 'DevOps and Cloud Computing expert. AWS and GCP certified instructor with practical industry experience.',
                avatarUrl: 'https://i.pravatar.cc/150?img=51',
            },
        ];

        const createdInstructors = [];
        for (const instructorData of instructorsData) {
            try {
                const [instructor] = await db
                    .insert(instructors)
                    .values(instructorData)
                    .returning();
                createdInstructors.push(instructor);
                logger.success(`Created instructor: ${instructorData.name}`);
            } catch (error: any) {
                logger.error(`Failed to create instructor ${instructorData.name}:`, error);
            }
        }

        logger.success('Instructors seeding completed!');
        return createdInstructors;
    } catch (error) {
        logger.error('Error seeding instructors:', error);
        throw error;
    }
}
