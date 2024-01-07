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
 * Executes before all tests in the describe block.
 * - Generates a new UUID for the artist.
 * - Inserts a test artist record into the database.
 * - Defines an example artwork using the inserted artist.
 * - Inserts the example artwork into the database.
 */
describe('GET /artists/:id', () => {
  beforeAll(async () => {
    try {
      const ARTISTUUID = uuidv4();
      exampleArtist = {
        uuid: ARTISTUUID,
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
      console.error(error);
    }
  });

  /**
   * Executes after all tests in the describe block.
   * - Deletes the test artwork and artist records from the database.
   * - Destroys the knex connection.
   */
  afterAll(async () => {
    try {
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex('artists').where({ uuid: exampleArtist.uuid }).del();
      await knex.destroy();
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * Test case: Should get all artists.
   * - Sends a GET request to '/artists'.
   * - Expects a 200 status code.
   * - Expects 'Leonardo da Vinci' to be present in the response body.
   */
  test('should get all artists', async () => {
    const response = await request(app).get('/artists');

    expect(response.status).toBe(200);
    const leonardoArtist = response.body.find((artist) => artist.artist === 'Leonardo da Vinci');
    expect(leonardoArtist).toBeDefined();
  });

  /**
   * Test case: Should get a specific artist by ID.
   * - Sends a GET request to '/artists/:id' using the ID of the inserted artist.
   * - Expects a 200 status code.
   * - Expects the response body to contain the correct artist name.
   */
  test('should get a specific artist by ID', async () => {
    const response = await request(app).get(`/artists/${insertedArtist[0].id}`);

    expect(response.status).toBe(200);
    expect(response.body.artist).toBe('Leonardo da Vinci');
  });

  /**
   * Test case: Should return an error for an invalid artist ID.
   * - Sends a GET request to '/artists/:id' with an invalid ID.
   * - Expects a 404 status code.
   * - Expects the response body to contain an 'error' field with the message 'Artist not found'.
   */
  test('should return an error for invalid artist ID', async () => {
    const invalidID = 999999; // Assuming this ID does not exist in your database
    const response = await request(app).get(`/artists/${invalidID}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Artist not found');
  });

  /**
   * Test case: Should return an error for a negative artist ID.
   * - Sends a GET request to '/artists/:id' with a negative ID.
   * - Expects a 401 status code.
   * - Expects the response body to contain a 'message' field with the message 'Invalid or negative ID provided'.
   */
  test('should return an error for negative artist ID', async () => {
    const negativeID = -1;
    const response = await request(app).get(`/artists/${negativeID}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid or negative ID provided');
  });
});
