import swaggerJSDoc from 'swagger-jsdoc'
import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Files API',
            version: '1.0.0',
            description: 'API para upload e consulta de pedidos',
        },
        servers: [
            {
                url: 'http://localhost:3636',
            },
        ],
    },
    apis: ['./src/routes/v1/files.routes.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
