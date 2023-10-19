// migrations/<timestamp>_create_artworks.js
exports.up = function (knex) {
    return knex.schema.createTable('artworks', function (table) {
      table.increments('id').primary();
      table.string('title')/* .notNullable() */;
      table.string('artist_uuid')/* .notNullable() */;
      table.string('image_url')/* .notNullable() */;
      table.string('location_geohash').notNullable();
      // Add any other columns as needed
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('artworks');
  };