import dotenv from 'dotenv'
dotenv.config()

import { envSchema } from '@/schemas/environment.schema'

const loadEnvironment = () => {
    try {
        return envSchema.parse(process.env)
    } catch (error) {
        console.error('Invalid environment variables:', error.errors)
        process.exit(1)
    }
}

export const environment = loadEnvironment()
