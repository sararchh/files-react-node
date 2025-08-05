import filesService from './files.service'
import { Request, Response } from 'express'
import fs from 'fs/promises'

const uploadFileController = async (req: Request, res: Response) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: 'Arquivo não enviado' })
        const content = await fs.readFile(req.file.path, 'utf-8')
        await filesService.processFileUpload(content)
        res.json({ message: 'Arquivo processado com sucesso' })
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
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
        res.status(500).json({ error: (error as Error).message })
    }
}

const filesController = {
    uploadFileController,
    getOrdersController,
}

export default filesController
