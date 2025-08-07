import { NextFunction, Request, Response } from 'express'
import { ZodError, fromZodError } from 'zod-validation-error'

export function validationSchemaMiddleware(schema: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { success, error } = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        })

        if (success) {
            next()
        } else {
            const { message } = fromZodError(error as ZodError)

            res.status(422).send({ name: 'ValidationError', message })
        }
    }
}
