/**
 * @param {import("knex").Knex} knex - The Knex instance for database operations.
 * @returns {Promise<void>} - A Promise that resolves when the migration is complete.
 */
exports.up = function (knex) {
  return knex.schema.alterTable('artists', function (table) {
    table.unique(['uuid']);
  });
};

/**
 * @param {import("knex").Knex} knex - The Knex instance for database operations.
 * @returns {Promise<void>} - A Promise that resolves when the migration is complete.
 */
exports.down = function (knex) {
  return knex.schema.table('artists', function (table) {
    table.dropColumn('uuid');
  });
};
