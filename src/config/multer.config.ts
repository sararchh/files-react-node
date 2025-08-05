import type { Request } from 'express'
import multer, { File as MulterFile } from 'multer'
import crypto from 'crypto'
import { extname, resolve } from 'path'

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'public', 'upload'),
        filename: (
            req: Request,
            file: MulterFile,
            cb: (error: Error | null, filename: string) => void
        ) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return cb(err, '')
                const filename =
                    buf.toString('hex') +
                    Date.now() +
                    extname(file.originalname)
                cb(null, filename)
            })
        },
    }),
}
