/**
 * @param { import("knex").Knex } knex - The Knex instance for performing database operations.
 * @returns { Promise<void> } - A promise that resolves when the migration is successfully applied.
 */
exports.up = function(knex) {
    return knex.schema.alterTable('artworks', function (table) {
        table.uuid('artist_uuid')
          .references('artists.uuid')
          .onUpdate('CASCADE')
          .onDelete('CASCADE').alter();
    });
};

/**
 * @param { import("knex").Knex } knex - The Knex instance for performing database operations.
 * @returns { Promise<void> } - A promise that resolves when the migration is successfully rolled back.
 */
exports.down = function(knex) {
    return knex.schema.table('artworks', function (table) {
        table.dropColumn('artist_uuid');
    });
};
