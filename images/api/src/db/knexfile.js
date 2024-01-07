/**
 * Database configuration for development environment.
 * @typedef {Object} DevelopmentConfig
 * @property {string} client - The database client (e.g., 'pg' for PostgreSQL).
 * @property {string} connection - The database connection string.
 * @property {Object} migrations - Configuration for database migrations.
 * @property {string} migrations.tableName - The name of the migrations table.
 * @property {string} migrations.directory - The directory where migration files are stored.
 */

/**
 * Exports the development configuration for the database.
 * @type {DevelopmentConfig}
 */
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
