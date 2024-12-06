import {user} from './user.js'

async function createOrUpdateTables() {
    try {
        await user.sync({ alter: true }); // Synchronizes the model with the database
        console.log(`User table has been created/updated.`)
    } catch (error) {
        console.error(`Error while creating/updating user table: ${error}`)
    }
}

export {createOrUpdateTables}