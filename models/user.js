import { DataTypes } from '@sequelize/core'
import {InitializeSequelize} from '../controller/db.js'
import {config} from '../controller/config.js'
import argon2 from 'argon2'

//Use the DB defined in our env params, i.e. the application DB
const sequelize = InitializeSequelize(false)

// Define the User model
const user = sequelize.define(config.dbUserTable, {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    primaryEmail: {
        type: DataTypes.STRING,
        allowNull: false
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
    maxUrls: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userActive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    userInactiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: true,
    indexes: [ 
        {
            unique: true,
            fields: ['primaryEmail']
        },
    ],
    hooks: {
        beforeSave: async (userInstance) => {
          if (userInstance.changed('apiKey')) {
            userInstance.apiKey = await argon2.hash(userInstance.apiKey)
          }
        },
    },
})


export { user }
