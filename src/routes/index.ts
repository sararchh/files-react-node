import express, { NextFunction, Request, Response } from 'express'

import filesRoutes from './v1/files.routes'

const routes = express.Router()


routes.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Servico em Operação 🟢 🚀' })
})

routes.use('/api/v1', filesRoutes)

export default routes
