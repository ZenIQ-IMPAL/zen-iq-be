import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Register a new user
     *     description: Create a new user account with full name, email, and password
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterRequest'
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       409:
     *         description: Email already registered
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
    */
    register = async (
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const result = await this.authService.register(req.body);

            logger.info(`New user registered: ${result.user.email}`);

            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil',
                data: { user: result.user },
            });
        } catch (error) {
            next(error);
        }
    };

    /**
        * @swagger
        * /api/auth/login:
        *   post:
        *     summary: User login
        *     description: Authenticate user with email and password
        *     tags:
        *       - Authentication
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/LoginRequest'
        *     responses:
        *       200:
        *         description: Login successful
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/AuthResponse'
        *       401:
        *         description: Invalid credentials
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/ErrorResponse'
        *       400:
        *         description: Validation error
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/ErrorResponse'
    */
    login = async (
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);

            logger.info(`User logged in: ${result.user.email}`);
            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                data: {
                    user: result.user,
                    token: result.token,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}