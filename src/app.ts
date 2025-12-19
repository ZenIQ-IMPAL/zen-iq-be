import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import { authRoutes } from './modules/auth/routes/auth.routes';
import { courseRoutes } from './modules/courses/routes/course.routes';
import { paymentRoutes } from './modules/payment/routes/payment.routes';
import { recommendationRoutes } from './modules/recommendation/routes/recommendation.routes';
import { subscriptionPlansRoutes } from './modules/subscription-plans/routes/subscription-plans.routes';
import { testimonialsRoutes } from './modules/testimonials/routes/testimonials.routes';
import { errorHandler } from './shared/middleware/error-handler';
import { requestLogger } from './shared/middleware/logger';
import { camelToSnakeResponse, snakeToCamelRequest } from './shared/middleware/transform-keys';

config();

const app = express();

app.use(helmet());

// CORS Configuration - Support multiple origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://zen-iq-be.onrender.com',
];

// Dynamically allow Vercel deployments
const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow specific origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow any Vercel deployment (*.vercel.app)
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Reject other origins
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
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
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Zen IQ API Documentation',
    })
);

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/subscription-plans', subscriptionPlansRoutes);
app.use('/api/payments', paymentRoutes);

app.use((_req, res, _next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
});

app.use(errorHandler);

export { app };
