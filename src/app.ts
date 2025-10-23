import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { authRoutes } from './modules/auth/routes/auth.routes';
import { courseRoutes } from './modules/courses/routes/course.routes';
import { recommendationRoutes } from './modules/recommendation/routes/recommendation.routes';
import { requestLogger } from './shared/middleware/logger';
import { errorHandler } from './shared/middleware/error-handler';
import { camelToSnakeResponse, snakeToCamelRequest } from './shared/middleware/transform-keys';
import { specs } from './config/swagger';

config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(snakeToCamelRequest);
app.use(camelToSnakeResponse);

app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Zen IQ API Documentation',
}));

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.use((_req, res, _next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
});

app.use(errorHandler);

export { app };