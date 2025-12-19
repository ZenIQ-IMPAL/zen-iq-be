import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { ValidationError } from '../utils/validation';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

type ErrorType = {
    statusCode: number;
    message: string;
    errorDetails?: any;
};

function handleValidationError(error: ValidationError): ErrorType {
    return {
        statusCode: error.statusCode,
        message: error.message,
        errorDetails: error.validationErrors,
    };
}

function handleAppError(error: AppError): ErrorType {
    return {
        statusCode: error.statusCode,
        message: error.message,
    };
}

function handleJwtError(error: Error): ErrorType {
    const isTokenExpired = error.name === 'TokenExpiredError';
    return {
        statusCode: 401,
        message: isTokenExpired ? 'Token expired' : 'Invalid token',
    };
}

function handleGenericError(error: Error): ErrorType {
    return {
        statusCode: 500,
        message: 'Internal Server Error',
        errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
    };
}

function determineErrorType(error: any): ErrorType {
    const isValidationError = error instanceof ValidationError;
    const isAppError = error instanceof AppError;
    const isJwtError = error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError';

    switch (true) {
        case isValidationError:
            return handleValidationError(error);
        case isAppError:
            return handleAppError(error);
        case isJwtError:
            return handleJwtError(error);
        default:
            return handleGenericError(error);
    }
}

export function errorHandler(
    error: any,
    _req: Request,
    res: Response<ApiResponse>,
    _next: NextFunction
): void {
    const { statusCode, message, errorDetails } = determineErrorType(error);

    logger.error(`${statusCode} - ${message}`, error);

    const response: ApiResponse = {
        success: false,
        message,
        ...(errorDetails && { error: errorDetails }),
    };

    res.status(statusCode).json(response);
}
