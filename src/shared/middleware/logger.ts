// src/shared/middleware/logger.ts
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const { statusCode } = res;

        const logLevel = statusCode >= 400 ? 'error' : 'info';
        logger[logLevel](`${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    });

    next();
}
