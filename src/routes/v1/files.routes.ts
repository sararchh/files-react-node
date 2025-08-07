import multer from 'multer'
import { Router } from 'express'
import multerConfig from '@/config/multer.config'
import { filesPayloadExists } from '@/middlewares/files-payload-exists.middleware'
import filesController from '@/modules/files/files.controller'

const upload = multer(multerConfig)
const router = Router()

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Faz upload de arquivo .txt
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo processado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post(
    '/upload',
    upload.single('file'),
    filesPayloadExists,
    filesController.uploadFileController
)

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Lista pedidos por filtros opcionais
 *     parameters:
 *       - in: query
 *         name: order_id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID do pedido
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data inicial (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             example:
 *               - user_id: 70
 *                 name: Palmer Prosacco
 *                 orders:
 *                   - date: "2021-03-08"
 *                     total: 4252.53
 *                     order_id: 753
 *                     products:
 *                       - value: 1836.74
 *                         product_id: 3
 *                       - value: 1009.54
 *                         product_id: 3
 *                       - value: 618.79
 *                         product_id: 4
 *                       - value: 787.46
 *                         product_id: 3
 *       400:
 *         description: Erro retornado pelo controller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "orderNotFoundError"
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 */
router.get('/orders', filesController.getOrdersController)

export default router
