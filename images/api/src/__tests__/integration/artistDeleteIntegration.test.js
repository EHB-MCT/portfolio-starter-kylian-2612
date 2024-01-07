// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const knex = require('knex')(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

/**
 * @description Set up test data before running tests.
 * @throws {Error} If any error occurs during setup.
 */
beforeAll(async () => {
  try {
    // Create a new UUID for the artist
    const ARTIST_UUID = uuidv4();
    exampleArtist = {
      uuid: ARTIST_UUID,
      artist: 'Leonardo da Vinci',
      birthyear: 1452,
      num_artworks: 20,
    };

    // Insert the artist
    insertedArtist = await knex('artists').insert(exampleArtist).returning('*');

    // Define exampleArtwork using the insertedArtist
    exampleArtwork = {
      title: 'Mona Lisa',
      artist_uuid: insertedArtist[0].uuid,
      image_url: 'https://example.com/mona_lisa.jpg',
      location_geohash: 'u4pruydqqw44',
    };

    // Insert the artwork
    insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning('*');
    exampleArtwork.id = insertedRecord[0].id;
  } catch (error) {
    console.log('error',error);
  }
});

/**
 * @description Clean up test data after running tests.
 * @throws {Error} If any error occurs during cleanup.
 */
afterAll(async () => {
  try {
    // Clean up: Delete the test record from the database after the test
    await knex('artworks').where({ id: exampleArtwork.id }).del();
    await knex('artists').where({ uuid: exampleArtist.uuid }).del();
    await knex.destroy();
  } catch (error) {
    console.error(error);
  }
});

describe('DELETE /artists/:id', () => {
  /**
   * @description Test if the API returns a 401 status code when a negative artist ID is provided.
   */
  test('should return 401 if negative ID provided', async () => {
    const response = await request(app).delete('/artists/-1');
    expect(response.status).toBe(401);
    // You can also check the response body for a specific error message
  });

  /**
   * @description Test if the API returns a 404 status code when the artist ID is not found.
   */
  test('should return 404 if artist not found', async () => {
    const nonExistentId = 999999; // Assuming this ID does not exist
    const response = await request(app).delete(`/artists/${nonExistentId}`);
    expect(response.status).toBe(404);
    // You can also check the response body for a specific error message
  });

  /**
   * @description Test if the API successfully deletes an artist.
   */
  test('should delete an artist successfully', async () => {
    // Make a request to delete the artist using its ID
    const response = await request(app).delete(`/artists/${insertedArtist[0].id}`);

    // Check if the response status is 204 (No Content)
    expect(response.status).toBe(204);
  });
});
