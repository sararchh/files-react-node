import filesService from '@/modules/files/files.service'
import { Request, Response } from 'express'
import fs from 'fs/promises'
import httpStatus from 'http-status'
import {
    invalidFileDataError,
    fileProcessError,
} from '@/modules/files/files.errors'

const uploadFileController = async (req: Request, res: Response) => {
    try {
        const filePath = req.file.path
        const content = await fs.readFile(filePath, 'utf-8')
        await filesService.processFileUpload(content)
        await fs.unlink(filePath)
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
