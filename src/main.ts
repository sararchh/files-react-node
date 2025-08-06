import 'dotenv/config'
import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { join } from 'path'
import http from 'http'
import { environment } from './config/environment.config'
import { DataBaseConection } from './config/db-connection.config'
import routes from './routes'

const envFile =
    process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development'
dotenv.config({ path: join(process.cwd(), envFile) })

const PORT = environment.PORT || 2424

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(routes)

const start = async () => {
    let dataBaseConection = new DataBaseConection()
    try {
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on port ${PORT}. 🚀`)
        })
    } catch (error) {
        console.error('Error starting server:', error)
        dataBaseConection._disconnect()
        process.exit(1)
    }
}

start()
