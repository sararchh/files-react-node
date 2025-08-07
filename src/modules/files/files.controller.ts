import filesService from '@/modules/files/files.service'
import { Request, Response } from 'express'
import fs from 'fs/promises'
import httpStatus from 'http-status'
import { invalidFileDataError, fileProcessError } from './errors/files.errors'
import { OrdersQuery } from './files.types'

const uploadFileController = async (req: Request, res: Response) => {
    try {
        const filePath = req.file.path
        const content = await fs.readFile(filePath, 'utf-8')
        await filesService.processFileUpload(content)
        await fs.unlink(filePath)
        res.json({ message: 'Arquivo processado com sucesso' })
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json(fileProcessError())
    }
}

const getOrdersController = async (req: Request, res: Response) => {
    try {
        const { order_id, start_date, end_date } = req.query
        const orders = await filesService.getNormalizedOrders({
            order_id,
            start_date,
            end_date,
        } as OrdersQuery)
        res.json(orders)
    } catch (error: any) {
        if (error?.name === 'orderNotFoundError') {
            return res.status(error.statusCode || 400).json(error)
        }

        return res.status(httpStatus.BAD_REQUEST).json(fileProcessError())
    }
}

const filesController = {
    uploadFileController,
    getOrdersController,
}

export default filesController
