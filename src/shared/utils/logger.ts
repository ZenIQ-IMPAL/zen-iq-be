import { createConsola } from 'consola';
import { env } from '../../config/env';

export const logger = createConsola({
    level: env.NODE_ENV === 'development' ? 4 : 3,
    formatOptions: {
        colors: true,
        compact: env.NODE_ENV === 'production',
        date: true,
    },
});
