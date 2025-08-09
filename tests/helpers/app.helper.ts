import express from 'express'
import cors from 'cors'
import routes from '../../src/routes'

export const createTestApp = () => {
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(routes)

    return app
}
