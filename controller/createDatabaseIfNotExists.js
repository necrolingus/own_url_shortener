import {InitializeSequelize} from './db.js'
import { config } from './config.js'

const sequelize = InitializeSequelize(true)
const dbName = config.dbDatabasename

async function ensureDatabaseExists() {
    try {
        await sequelize.authenticate()
        console.log('Connected to the default database.')

        // Check if the database exists
        const [results] = await sequelize.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`, 
            { bind: [dbName] }
        )

        if (results.length === 0) {
            console.log(`Database "${dbName}" does not exist. Creating it now...`)
            await sequelize.query(`CREATE DATABASE "${dbName}"`)
            console.log(`Database "${dbName}" created successfully.`)
        } else {
            console.log(`Database "${dbName}" already exists.`)
        }

    } catch (error) {
        console.error('Error ensuring database exists:', error)
    } finally {
        await sequelize.close() 
    }
}

export {ensureDatabaseExists}