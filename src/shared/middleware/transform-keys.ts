import { Request, Response, NextFunction } from 'express';

function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function transformObjectKeys(obj: any, transformer: (key: string) => string): any {
    const isArray = Array.isArray(obj);
    const isDate = obj instanceof Date;
    const isObject = obj !== null && typeof obj === 'object' && !isArray && !isDate;

    switch (true) {
        case isDate:
            return obj;
        case isArray:
            return obj.map((item: any) => transformObjectKeys(item, transformer));
        case isObject:
            return Object.keys(obj).reduce((result, key) => {
                const transformedKey = transformer(key);
                const transformedValue = transformObjectKeys(obj[key], transformer);
                result[transformedKey] = transformedValue;
                return result;
            }, {} as any);
        default:
            return obj;
    }
}

export function snakeToCamelRequest(req: Request, _res: Response, next: NextFunction): void {
    const hasBody = req.body && Object.keys(req.body).length > 0;

    switch (hasBody) {
        case true:
            req.body = transformObjectKeys(req.body, toCamelCase);
            break;
    }

    next();
}

export function camelToSnakeResponse(_req: Request, res: Response, next: NextFunction): void {
    const originalJson = res.json;

    res.json = function (body: any) {
        const transformedBody = transformObjectKeys(body, toSnakeCase);
        return originalJson.call(this, transformedBody);
    };

    next();
}