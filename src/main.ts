import express from 'express'
import http from 'http'
import 'reflect-metadata'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import routes from '@/routes/index'
import path from 'path'

const app = express()

app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }))
app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
    })
)

app.use(
    '/upload',
    express.static(path.resolve(__dirname, '..', 'public', 'upload'))
)

app.set('view engine', 'ejs')

app.use(routes)

const PORT = process.env.PORT || 3333

const start = async () => {
    try {
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on port ${PORT}. 🚀`)
        })
    } catch (error) {
        process.exit(1)
    }
}

start()
