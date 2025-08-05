import { Sequelize } from 'sequelize-typescript'
import { environment } from './environment.config'
import { entitiesMap } from '@/database/entitiesMap'
import { Dialect } from 'sequelize'

export class DataBaseConection {
    private conSequelize: Sequelize | null = null

    constructor() {
        this._initDb()
    }

    async _initDb() {
        this.conSequelize = new Sequelize({
            dialect: environment?.DB_DIALECT as Dialect,
            host: environment?.DB_HOST,
            port: Number(environment?.DB_PORT),
            database: environment?.DB_DATABASE,
            username: environment?.DB_USER,
            password: environment?.DB_PASS,
            logging: false,
            models: entitiesMap,
            query: { raw: true },
        })

        this.conSequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully. 🟢')
                this._sync()
            })
            .catch((error) => {
                console.error('❌ Unable to connect to the database: ', error)
            })
    }

    _sync() {
        if (this.conSequelize) {
            this.conSequelize.sync()
            console.log(`Database connected and sync. 🟣`)
        }
    }

    _disconnect() {
        if (this.conSequelize) {
            this.conSequelize.close()
            console.log(`Database disconnected. ❌`)
        }
    }
}
