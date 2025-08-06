import { z } from 'zod'

export const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'tests', 'production'])
        .default('development'),
    PORT: z.coerce.number().default(2424),

    APP_WEB_URL: z.coerce.string().optional(),
    TZ: z.coerce.string().optional(),

    DB_DIALECT: z.coerce.string().default('mysql'),
    DB_USER: z.coerce.string(),
    DB_PASS: z.coerce.string(),
    DB_HOST: z.coerce.string(),
    DB_DATABASE: z.coerce.string(),
    DB_PORT: z.coerce.number().default(3306),
})
