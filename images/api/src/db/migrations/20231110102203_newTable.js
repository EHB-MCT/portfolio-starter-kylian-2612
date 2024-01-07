/**
 * @param {import("knex").Knex} knex - The Knex instance.
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable('artists', function (table) {
    table.increments('id').primary();
    table.string('artist');
    table.uuid('uuid');
    table.float('birthyear');
    table.float('num_artworks');
  });
};

/**
 * @param {import("knex").Knex} knex - The Knex instance.
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('artists');
};
