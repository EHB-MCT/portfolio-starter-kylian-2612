// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const knex = require('knex')(knexfile.development);

let insertedRecord;
let exampleArtwork;
let exampleArtist;

/**
 * Test suite for the POST /artists endpoint to create a new artist.
 */
describe('POST /artists/:id', () => {
  beforeAll(async () => {
    // Create a new UUID for the artist
    const ARTISTUUID = uuidv4();
    exampleArtist = {
      uuid: ARTISTUUID,
      artist: 'Leonardo da Vinci',
      birthyear: 1452,
      num_artworks: 20,
    };
    
    // Insert the artist
    await knex('artists').insert({ ...exampleArtist });

    // Define exampleArtwork using the insertedArtist
    exampleArtwork = {
      title: 'Mona Lisa',
      artist_uuid: exampleArtist.uuid,
      image_url: 'https://example.com/mona_lisa.jpg',
      location_geohash: 'u4pruydqqw43',
    };

    // Insert the artwork
    insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning('*');
    exampleArtwork.id = insertedRecord[0].id;
  });

  afterAll(async () => {
    if (exampleArtwork.id) {
      // Clean up: Delete the test record from the database after the test
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex.destroy();
    }
  });

  /**
   * @param {Object} response - The HTTP response object from the API call.
   * Test case to verify the successful creation of a new artist.
   */
  test('should create a new artist', async () => {
    const response = await request(app)
      .post('/artists')
      .send({
        artist: 'Test Artist',
        uuid: uuidv4(),
        birthyear: 8000,
        num_artworks: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Artist created successfully');
    expect(response.body.artist).toHaveProperty('id');
    expect(response.body.artist.artist).toBe('Test Artist');

    // Clean up: Delete the created test artist from the database
    await request(app).delete(`/artists/${response.body.artist.id}`);
  });

  /**
   * @param {Object} response - The HTTP response object from the API call.
   * Test case to handle errors when creating an artist with invalid data.
   */
  test('should handle errors when creating an artist with invalid data', async () => {
    const response = await request(app)
      .post('/artists')
      .send({
        // Invalid data, missing required fields
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  /**
   * @param {Object} response - The HTTP response object from the API call.
   * Test case to handle errors when creating an artist with an empty name.
   */
  test('should handle errors when creating an artist with an empty name', async () => {
    const response = await request(app)
      .post('/artists')
      .send({
        artist: '',
        uuid: uuidv4(),
        birthyear: 5000,
        num_artworks: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid data. Missing required fields.');
  });

  /**
   * @param {Object} response - The HTTP response object from the API call.
   * Test case to handle errors when creating an artist with an invalid name.
   */
  test('should handle errors when creating an artist with an invalid name', async () => {
    const response = await request(app)
      .post('/artists')
      .send({
        artist: null, // Invalid name
        uuid: uuidv4(),
        birthyear: 6000,
        num_artworks: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid data. Missing required fields.');
  });

  /**
   * @param {Object} response - The HTTP response object from the API call.
   * Test case to handle errors when creating an artist with an empty property.
   */
  test('should handle errors when creating an artist with an empty property', async () => {
    const response = await request(app)
      .post('/artists')
      .send({
        // Missing 'artist' property
        uuid: uuidv4(),
        birthyear: 4000,
        num_artworks: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Invalid data. Missing required fields.');
  });
});
