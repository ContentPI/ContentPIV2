import Config from '../config'

export const db = require('knex')({
  client: Config.database?.engine,
  debug: Config.database?.debug,
  connection: {
    database: Config.database?.database,
    user: Config.database?.username,
    password: Config.database?.password
  },
  migrations: {
    tableName: 'knex_migrations'
  },
  useNullAsDefault: true
})
