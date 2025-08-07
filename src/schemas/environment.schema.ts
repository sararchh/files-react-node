import { z } from 'zod'

export const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'tests', 'production'])
        .default('development'),
    PORT: z.coerce.number().default(3636),

    TZ: z.coerce.string().optional(),

    DB_CONNECTION: z.coerce.string().default('mysql'),
    DB_HOST: z.coerce.string(),
    DB_PORT: z.coerce.number().default(3306),
    DB_DATABASE: z.coerce.string(),
    DB_USER: z.coerce.string(),
    DB_PASS: z.coerce.string(),
})
