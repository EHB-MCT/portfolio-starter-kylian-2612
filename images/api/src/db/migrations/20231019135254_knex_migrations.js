// migrations/<timestamp>_create_artworks.js

exports.up = function(knex) {
  return knex.schema.createTable('artworks', function(table) {
    table.increments('id').primary();
    table.string('title');
    table.string('artist_uuid');
    table.string('image_url');
    table.string('location_geohash').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('artworks');
};
