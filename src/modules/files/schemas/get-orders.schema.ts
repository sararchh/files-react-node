import { z } from 'zod'

export const getOrdersSchema = z.object({
    query: z.object({
        order_id: z.preprocess(
            (val) => (typeof val === 'string' ? Number(val) : val),
            z.number().int().positive().optional()
        ),
        start_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .optional(),
        end_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .optional(),
    }),
})
