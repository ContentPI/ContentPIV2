export default {
  development: {
    client: 'postgresql',
    debug: true,
    connection: {
      database: 'contentpi_latest',
      user: 'czantany',
      password: '12345678'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }
}
