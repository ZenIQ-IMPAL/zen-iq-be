import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Zen IQ Backend API',
            version: '1.0.0',
            description:
                'Express.js REST API with TypeScript, Neon Postgres, Drizzle ORM, and JWT Authentication',
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                RegisterRequest: {
                    type: 'object',
                    required: ['full_name', 'email', 'password'],
                    properties: {
                        full_name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'Password123' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', example: 'Password123' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        full_name: { type: 'string' },
                                        email: { type: 'string', format: 'email' },
                                    },
                                },
                                token: { type: 'string' },
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        error: { type: 'object' },
                    },
                },
            },
        },
    },
    apis: ['./src/modules/auth/controllers/auth.controller.ts', './src/app.ts'],
};

export const specs = swaggerJsdoc(options);
