import {
    fileNotFoundError,
    fileExtError,
    fileSizeError,
    fileValidationError,
} from '@/modules/files/errors/files.errors'
import { Request, Response, NextFunction } from 'express'

import httpStatus from 'http-status'

const maxSize = 1 * 1000 * 1000 // 1MB
const filetypes = /txt$/i

export const filesPayloadExists = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return res.status(httpStatus.UNAUTHORIZED).json(fileNotFoundError())
    }
    const file = req.file
    try {
        const mimetype = filetypes.test(file.originalname)
        if (!mimetype) {
            return res.status(httpStatus.BAD_REQUEST).json(fileExtError())
        }
        if (file.size > maxSize) {
            return res.status(httpStatus.BAD_REQUEST).json(fileSizeError())
        }
        next()
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json(fileValidationError())
    }
}
