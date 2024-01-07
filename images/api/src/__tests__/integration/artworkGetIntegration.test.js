// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const knex = require('knex')(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist at a higher scope

/**
 * Setup function to insert an artist and artwork into the database for testing.
 */
beforeAll(async () => {
  try {
    // Define exampleArtist
    exampleArtist = {
      uuid: uuidv4(),
      artist: 'Leonardo da Vinci',
      birthyear: 1452,
      num_artworks: 20,
    };

    // Insert the artist and get the inserted record
    insertedArtist = await knex('artists')
      .insert(exampleArtist)
      .returning('*');

    // Define exampleArtwork using the insertedArtist
    exampleArtwork = {
      title: 'Mona Lisa',
      artist_uuid: insertedArtist[0].uuid,
      image_url: 'https://example.com/mona_lisa.jpg',
      location_geohash: 'u4pruydqqw43',
    };

    // Insert the artwork and get the inserted record
    insertedRecord = await knex('artworks')
      .insert({ ...exampleArtwork })
      .returning('*');
    exampleArtwork.id = insertedRecord[0].id;
  } catch (error) {
    console.error('Error during setup:', error);
  }
});

/**
 * Cleanup function to delete the test records from the database after testing.
 */
afterAll(async () => {
  // Clean up: Delete the test record from the database after the test
  // Uncomment the following lines when you are ready to implement the cleanup logic
  await knex('artworks').where({ id: exampleArtwork.id }).del();
  await knex('artists').where({ uuid: exampleArtist.uuid }).del();
  await knex.destroy();
});

describe('GET /artworks/:id', () => {
  /**
   * Test to verify that the correct artwork record is returned.
   * @param {number} exampleArtwork.id - The ID of the test artwork record.
   */
  test('should return the correct artwork record', async () => {
    const artworkId = exampleArtwork.id;
    const response = await request(app).get(`/artworks/${insertedRecord[0].id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(exampleArtwork.title);

    const knexRecord = await knex('artworks').select('*').where('id', artworkId);
    expect(knexRecord.length).toBeGreaterThan(0);
    expect(knexRecord[0]).toHaveProperty('id', artworkId);
  });

  /**
   * Test to verify that a 404 status is returned when the artwork does not exist.
   * @param {number} invalidArtworkId - Invalid ID that does not exist in the database.
   */
  test('should return 404 when not exist', async () => {
    const invalidArtworkId = 99999;
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(404);

    const knexRecord = await knex('artworks').select('*').where('id', invalidArtworkId);
    expect(knexRecord.length).toBe(0);
  });

  /**
   * Test to verify that a 401 status is returned for a negative artwork ID.
   * @param {number} invalidArtworkId - Negative ID that is not allowed.
   */
  test('should return 401 for a negative artworkID', async () => {
    const invalidArtworkId = -12;
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(401);
  });

  /**
   * Test to verify that a 401 status is returned for a non-numeric artwork ID.
   * @param {string} invalidArtworkId - Non-numeric ID (string).
   */
  test('should return 401 for a string', async () => {
    const invalidArtworkId = 'hello';
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(401);
  });

  /**
   * Test to verify that a 401 status is returned for a too large artwork ID.
   * @param {number} invalidArtworkId - ID that exceeds the allowed range.
   */
  test('should return 401 for a too large artworkID', async () => {
    const invalidArtworkId = 999999999;
    const response = await request(app).get(`/artworks/${invalidArtworkId}`);
    expect(response.status).toBe(401);
  });
});
