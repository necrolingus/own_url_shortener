import {user} from './user.js'
import {path} from './path.js'

async function createOrUpdateTables() {
    try {
        //Sync user table
        await user.sync({ alter: true }); 
        console.log(`User table has been created/updated.`)

        //Sync path table
        await path.sync({ alter: true }); 
        console.log(`Path table has been created/updated.`)

        //Add the foreign key relationship
        user.hasMany(path, {
            foreignKey: 'userId', 
        });
        path.belongsTo(user, {
            foreignKey: 'userId',
        });
        
    } catch (error) {
        console.error(`Error while creating/updating user table: ${error}`)
    }
}

export {createOrUpdateTables}