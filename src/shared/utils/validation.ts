import type { z } from 'zod';

export class ValidationError extends Error {
    public statusCode: number;
    public validationErrors: Record<string, string>;

    constructor(message: string, validationErrors: Record<string, string>) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.validationErrors = validationErrors;
    }
}

function formatZodErrors(issues: z.ZodIssue[]): Record<string, string> {
    return issues.reduce(
        (acc, issue) => {
            const field = issue.path.join('.');
            acc[field] = issue.message;
            return acc;
        },
        {} as Record<string, string>
    );
}

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);

    const isSuccess = result.success;

    switch (isSuccess) {
        case false: {
            const validationErrors = formatZodErrors(result.error.issues);
            throw new ValidationError('Validation Error', validationErrors);
        }
        case true:
            return result.data;
    }
}
