import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import {config} from '../controller/config.js'

function InitializeSequelize (defaultDB=false) {
  //Check if we should connect to the default postgres database
  //in order to create a new database for our app or use
  //the database name passed through as an env param
  let dbName = ''

  if (defaultDB === true) {
    dbName = 'postgres'
  } else {
    dbName = config.dbDatabasename
  }

  // Initialize Sequelize
  const sequelize = new Sequelize({
    dialect: PostgresDialect,
    host: config.dbHostname,
    port: config.dbPort,
    database: dbName,
    user: config.dbUsername,
    password: config.dbPassword,
    ssl: false,
    clientMinMessages: 'notice',
  });
  return sequelize
}

export {InitializeSequelize}