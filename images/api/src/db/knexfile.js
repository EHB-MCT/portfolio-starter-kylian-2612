module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING || "postgres://test:test@localhost:5432/test",
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
