import { Router } from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import filesController from '@/modules/files/files.controller'

const upload = multer({ dest: 'upload/' })
const router = Router()

router.post(
    '/upload',
    upload.single('file'),
    filesController.uploadFileController
)
router.get('/orders', filesController.getOrdersController)

export default router
