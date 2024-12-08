import { DataTypes } from '@sequelize/core'
import {InitializeSequelize} from '../controller/db.js'
import {config} from '../controller/config.js'

//Use the DB defined in our env params, i.e. the application DB
const sequelize = InitializeSequelize(false)

const audit = sequelize.define(config.dbAuditTable, {
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
        type: DataTypes.JSON,
        allowNull: false,
    },
    allHeaders: {
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    timestamps: true,
})

export {audit}
