import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

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
                message: 'User registered successfully',
                data: { user: result.user },
            });
        } catch (error) {
            next(error);
        }
    };

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
                message: 'Logged in successfully',
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