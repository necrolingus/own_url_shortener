import { DataTypes } from '@sequelize/core'
import {InitializeSequelize} from '../controller/db.js'

//Use the DB defined in our env params, i.e. the application DB
const sequelize = InitializeSequelize(false)

const audit = sequelize.define('audit', {
    responseCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fullPath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    httpMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSON, // Stores JSON data
        allowNull: false,
    },
    allHeaders: {
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    timestamps: true, // No automatic `createdAt` and `updatedAt`
})

export {audit}
