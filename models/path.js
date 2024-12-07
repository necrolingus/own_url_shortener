import { DataTypes } from '@sequelize/core'
import {InitializeSequelize} from '../controller/db.js'
import {config} from '../controller/config.js'
import {user} from './user.js'

//Use the DB defined in our env params, i.e. the application DB
const sequelize = InitializeSequelize(false)

// Define the Path model
const path = sequelize.define(config.dbPathTable, {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    redirect: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expireDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pathActive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    pathInactiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user,
            key: 'id'
        },
        //onDelete: 'CASCADE', // Optional: Delete paths if the user is deleted
        //onUpdate: 'CASCADE', // Optional: Update paths if the user's id changes
    }
}, {
    timestamps: true,  //Include timestamps
    indexes: [ 
        {
            unique: true,
            fields: ['path']
        },
    ]
});

export { path }
