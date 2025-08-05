import filesService from '@/modules/files/files.service'
import { Request, Response } from 'express'
import fs from 'fs/promises'
import httpStatus from 'http-status'
import {
    invalidFileDataError,
    fileProcessError,
} from '@/modules/files/files.errors'
import type { Request as ExpressRequest } from 'express'

interface MulterRequest extends ExpressRequest {
    file?: {
        path: string
        [key: string]: any
    }
}

const uploadFileController = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(invalidFileDataError())
        }
        const content = await fs.readFile(req.file.path, 'utf-8')
        await filesService.processFileUpload(content)
        res.json({ message: 'Arquivo processado com sucesso' })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(fileProcessError())
    }
}

const getOrdersController = async (req: Request, res: Response) => {
    try {
        const { order_id, start_date, end_date } = req.query
        const orders = await filesService.getNormalizedOrders({
            order_id,
            start_date,
            end_date,
        })
        res.json(orders)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(fileProcessError())
    }
}

const filesController = {
    uploadFileController,
    getOrdersController,
}

export default filesController
