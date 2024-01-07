// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const knex = require('knex')(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist here

/**
 * @description Setup before running the tests
 */
describe('UPDATE /artists/:id', () => {
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
      console.log('error', error);
    }
  });

  /**
   * @description Cleanup after running the tests
   */
  afterAll(async () => {
    try {
      // Clean up: Delete the test record from the database after the test
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex('artists').where({ uuid: exampleArtist.uuid }).del();
      await knex.destroy();
    } catch (error) {
      console.log('error', error);
    }
  });

  /**
   * @description Test for updating an artist successfully
   */
  test('should update an artist successfully', async () => {
    /**
     * @param {Object} updatedData - The updated data for the artist
     * @param {string} updatedData.artist - The updated artist name
     * @param {number} updatedData.birthyear - The updated birth year of the artist
     * @param {number} updatedData.num_artworks - The updated number of artworks by the artist
     */
    const updatedData = {
      artist: 'Updated Artist',
      birthyear: 1500,
      num_artworks: 25,
    };

    const response = await request(app)
      .put(`/artists/${insertedArtist[0].id}`)
      .send(updatedData)
      .expect(200);

    expect(response.text).toBe('Artist updated successfully');

    // Validate the updated data in the database
    const updatedArtist = await knex('artists').where({ id: insertedArtist[0].id }).first();
    expect(updatedArtist.artist).toBe(updatedData.artist);
    expect(updatedArtist.birthyear).toBe(updatedData.birthyear);
    expect(updatedArtist.num_artworks).toBe(updatedData.num_artworks);
  });

  /**
   * @description Test for returning 404 if artist ID is not found
   */
  test('should return 404 if artist ID is not found', async () => {
    /**
     * @param {number} nonExistentId - ID that doesn't exist in the database
     */
    const nonExistentId = 999999;

    const response = await request(app)
      .put(`/artists/${nonExistentId}`)
      .send({ artist: 'Updated Artist' })
      .expect(404);

    expect(response.body.error).toBe('Artist not found');
  });

  /**
   * @description Test for returning 401 if negative ID is provided
   */
  test('should return 401 if negative ID is provided', async () => {
    /**
     * @param {number} negativeId - Negative ID provided
     */
    const negativeId = -1;

    const response = await request(app)
      .put(`/artists/${negativeId}`)
      .send({ artist: 'Updated Artist' })
      .expect(401);

    expect(response.body.message).toBe('Invalid or negative ID provided');
  });

  /**
   * @description Test for updating the artist with partial data
   */
  test('should update the artist with partial data', async () => {
    /**
     * @param {Object} partialData - Partial data to update the artist
     * @param {number} partialData.num_artworks - The updated number of artworks by the artist
     */
    const partialData = {
      num_artworks: 30,
    };

    const response = await request(app)
      .put(`/artists/${insertedArtist[0].id}`)
      .send(partialData)
      .expect(200);

    expect(response.text).toBe('Artist updated successfully');

    // Validate the updated data in the database
    const updatedArtist = await knex('artists').where({ id: insertedArtist[0].id }).first();
    expect(updatedArtist.num_artworks).toBe(partialData.num_artworks);
  });
});
