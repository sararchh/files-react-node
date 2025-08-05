import express from 'express'
import http from 'http'
import 'reflect-metadata'
// import https from "https";
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import routes from './routes/index'
// import './jobs/index';
import { environment } from '@/config/environment.config'
import { DataBaseConection } from './config/dbConnection'
import path from 'path'

// const SSL_PORT = `${process.env.SSL_PORT}` || 4434;

// const options = {
//     key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'cert.pem')),
// };

const app = express()

// Tratamento de Cors, lliberação ou bloqueio de acessos externos
app.use(cors())

// Define tipo de retorno das rotas da API
// app.use(express.json());
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

const PORT = environment.PORT || 3333

const start = async () => {
    let dataBaseConection = new DataBaseConection()
    try {
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on port ${PORT}. 🚀`)
        })

        // https.createServer(options, server).listen(SSL_PORT, () => {
        //     console.log(`Server is running on port ${SSL_PORT}. 🚀`);
        // });
    } catch (error) {
        dataBaseConection._disconnect()
        // console.error("error", error);
        process.exit(1)
    }
}

start()
