import { app } from './app';
import { env } from './config/env';
import {
    startSubscriptionExpiryCron,
    stopSubscriptionExpiryCron,
} from './shared/cron/subscription-expiry.cron';
import { logger } from './shared/utils/logger';

async function startServer() {
    try {
        const server = app.listen(env.PORT, () => {
            logger.success(`Server is running on port ${env.PORT}`);
            logger.info(`Environment: ${env.NODE_ENV}`);
            logger.info(`Health check: http://localhost:${env.PORT}/health`);
            logger.info(`Auth endpoint: http://localhost:${env.PORT}/api/auth`);

            // Start cron jobs
            startSubscriptionExpiryCron();
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('IGTERM received, shutting down gracefully');
            stopSubscriptionExpiryCron();
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully');
            stopSubscriptionExpiryCron();
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
