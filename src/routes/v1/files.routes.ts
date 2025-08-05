import multerConfig from '@/config/multer.config'
import { filesPayloadExists } from '@/middlewares/files-payload-exists.middleware'
import filesController from '@/modules/files/files.controller'

import multer from 'multer'
import { Router } from 'express'

const upload = multer(multerConfig)
const router = Router()

router.post(
    '/upload',
    upload.single('file'),
    filesPayloadExists,
    filesController.uploadFileController
)
router.get('/orders', filesController.getOrdersController)

export default router
