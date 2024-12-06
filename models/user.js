import { DataTypes } from '@sequelize/core'
import {InitializeSequelize} from '../controller/db.js'
import {config} from '../controller/config.js'

//Use the DB defined in our env params, i.e. the application DB
const sequelize = InitializeSequelize(false)

// Define the User model
const user = sequelize.define(config.dbUserTable, {
    primaryEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Part of the composite primary key
    },
    secondayEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    apiKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Part of the composite primary key
    },
    maxUrls: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,  // Disable timestamps if not needed
});

// Immediately Invoked Async Function Expression (IIAFE)
// (async () => {
//     await sequelize.sync();
//     console.log('The table has been created/updated.');
// })();

// async function createOrUpdateTable() {
//     try {
//         await user.sync({ alter: true }); // Synchronizes the model with the database
//         console.log(`${config.dbUserTable} table has been created/updated.`)
//     } catch (error) {
//         console.error(`Error while creating/updating ${config.dbUserTable}:`, error)
//     }
// }
// createOrUpdateTable()

export { user }
