// migrations/<timestamp>_create_artworks.js

/**
 * @param {import('knex')} knex - Knex instance for interacting with the database.
 * @returns {Promise} A promise that resolves when the migration is complete.
 */
exports.up = function(knex) {
  return knex.schema.createTable('artworks', function(table) {
    /**
     * @param {string} 'id' - The primary key for the 'artworks' table, auto-incremented.
     * @param {string} 'title' - The title of the artwork.
     * @param {string} 'artist_uuid' - The UUID of the artist associated with the artwork.
     * @param {string} 'image_url' - The URL of the image representing the artwork.
     * @param {string} 'location_geohash' - The geohash representing the location of the artwork.
     */
    table.increments('id').primary();
    table.string('title');
    table.string('artist_uuid');
    table.string('image_url');
    table.string('location_geohash').notNullable();
  });
};

/**
 * @param {import('knex')} knex - Knex instance for interacting with the database.
 * @returns {Promise} A promise that resolves when the rollback is complete.
 */
exports.down = function(knex) {
  /**
   * @param {string} 'artworks' - The name of the 'artworks' table to be dropped.
   */
  return knex.schema.dropTable('artworks');
};
