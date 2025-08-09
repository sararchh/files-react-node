import { Request, Response, NextFunction } from 'express'
import { filesPayloadExists } from '../../src/middlewares/files-payload-exists.middleware'
import {
    fileNotFoundError,
    fileExtError,
    fileSizeError,
    fileValidationError,
} from '../../src/modules/files/errors/files.errors'
import httpStatus from 'http-status'

describe('filesPayloadExists middleware', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        req = {}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        next = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return error when file is not present', () => {
        req.file = undefined

        filesPayloadExists(req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED)
        expect(res.json).toHaveBeenCalledWith(fileNotFoundError())
        expect(next).not.toHaveBeenCalled()
    })

    it('should return error when file extension is invalid', () => {
        req.file = {
            originalname: 'test.pdf',
            size: 500000,
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith(fileExtError())
        expect(next).not.toHaveBeenCalled()
    })

    it('should return error when file is too large', () => {
        req.file = {
            originalname: 'test.txt',
            size: 2000000, // 2MB > 1MB limit
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith(fileSizeError())
        expect(next).not.toHaveBeenCalled()
    })

    it('should call next() when file is valid', () => {
        req.file = {
            originalname: 'test.txt',
            size: 500000, // 500KB < 1MB limit
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    })

    it('should accept .txt files in uppercase', () => {
        req.file = {
            originalname: 'test.TXT',
            size: 500000,
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(next).toHaveBeenCalled()
    })

    it('should accept .txt files in mixed case', () => {
        req.file = {
            originalname: 'test.Txt',
            size: 500000,
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(next).toHaveBeenCalled()
    })

    it('should return validation error when exception occurs', () => {
        req.file = {
            originalname: 'test.txt',
            size: 500000,
        }

        const originalTest = RegExp.prototype.test
        RegExp.prototype.test = jest.fn().mockImplementation(() => {
            throw new Error('Regex error')
        })

        filesPayloadExists(req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith(fileValidationError())
        expect(next).not.toHaveBeenCalled()

        RegExp.prototype.test = originalTest
    })

    it('should accept file exactly at size limit', () => {
        req.file = {
            originalname: 'test.txt',
            size: 1000000, // Exactly 1MB
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(next).toHaveBeenCalled()
    })

    it('should reject file with one byte over the limit', () => {
        req.file = {
            originalname: 'test.txt',
            size: 1000001, // 1MB + 1 byte
        }

        filesPayloadExists(req as Request, res as Response, next)

        expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(res.json).toHaveBeenCalledWith(fileSizeError())
        expect(next).not.toHaveBeenCalled()
    })
})
