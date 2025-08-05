import { Request, Response } from 'express'
import fs from 'fs/promises'
import filesService from '../services/files.service'

const uploadFileController = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' })
    const content = await fs.readFile(req.file.path, 'utf-8')
    await filesService.processFileUpload(content)
    res.json({ message: 'Arquivo processado com sucesso' })
}

const getOrdersController = async (req: Request, res: Response) => {
    const { order_id, start_date, end_date } = req.query
    const orders = await filesService.getNormalizedOrders({
        order_id,
        start_date,
        end_date,
    })
    res.json(orders)
}

const filesController = {
    uploadFileController,
    getOrdersController,
}

export default filesController
