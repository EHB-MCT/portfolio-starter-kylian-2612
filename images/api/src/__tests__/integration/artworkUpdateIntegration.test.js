// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const knex = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

/**
 * @description Setup before running the tests
 */
describe('UPDATE /artworks/:id', () => {

  /**
   * @description Before all tests, insert an example artist and artwork into the database
   */
  beforeAll(async () => {
    try {
      const ARTIST_UUID = uuidv4();
      exampleArtist = {
        uuid: ARTIST_UUID,
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        num_artworks: 20
      };

      insertedArtist = await knex('artists').insert(exampleArtist).returning("*");

      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw44'
      };

      insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;

    } catch (error) {
      console.error(error);
    }
  });

  /**
   * @description After all tests, clean up the database
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
   * @description Test updating artwork with valid data
   */
  test('should update the artwork when valid data is provided', async () => {
    /**
     * @type {Object} updatedArtwork - Updated artwork data
     * @property {number} id - ID of the artwork to be updated
     * @property {string} title - Updated title
     * @property {string} artist_uuid - UUID of the artist associated with the artwork
     * @property {string} image_url - Updated image URL
     * @property {string} location_geohash - Updated location geohash
     */
    const updatedArtwork = {
      id: exampleArtwork.id,
      title: 'Updated Mona Lisa',
      artist_uuid: exampleArtwork.artist_uuid,
      image_url: 'https://example.com/updated_mona_lisa.jpg',
      location_geohash: 'u4pruydqqw44',
    };

    // Check if the artist exists, if not, create a new artist
    const artistExists = await knex('artists').where('uuid', updatedArtwork.artist_uuid).first();

    if (!artistExists) {
      const newArtist = {
        uuid: updatedArtwork.artist_uuid,
        artist: 'New Artist',
        birthyear: 2000,
        num_artworks: 0,
      };

      await knex('artists').insert(newArtist);
    }

    // Send a request to update the artwork
    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(updatedArtwork);

    // Assertions
    expect(response.status).toBe(200);

    const knexRecord = await knex('artworks').select('*').where('id', updatedArtwork.id);
    expect(knexRecord.length).toBe(1);

    const updatedRecord = knexRecord[0];
    expect(updatedRecord.title).toBe(updatedArtwork.title);
    expect(updatedRecord.image_url).toBe(updatedArtwork.image_url);
    expect(updatedRecord.location_geohash).toBe('u4pruydqqw44');
  });

  /**
   * @description Test updating artwork with invalid data
   */
  test('should return 200 when invalid data is provided', async () => {
    /**
     * @type {Object} invalidArtwork - Artwork data with invalid fields
     * @property {string} title - Invalid title
     * @property {string} artist_uuid - Invalid artist_uuid
     * @property {string} image_url - Invalid image URL
     * @property {string} location_geohash - Invalid location geohash
     */
    const invalidArtwork = {
      title: '', // Invalid title
      artist_uuid: uuidv4(), // Invalid artist_uuid
      image_url: 'https://example.com/invalid_image.jpg',
      location_geohash: 'invalid_hash',
    };

    // Create a valid artist to associate with the invalid artwork
    const validArtist = {
      uuid: invalidArtwork.artist_uuid,
      artist: 'Valid Artist',
      birthyear: 2000,
      num_artworks: 0,
    };

    await knex('artists').insert(validArtist);

    // Send a request to update the artwork with invalid data
    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(invalidArtwork);

    // Assertions
    expect(response.status).toBe(200);
  });

  /**
   * @description Test updating non-existing artwork
   */
  test('should return 404 when updating non-existing artwork', async () => {
    /**
     * @type {number} nonExistingId - Non-existing artwork ID
     */
    const nonExistingId = 999999; // Non-existing ID

    // Send a request to update a non-existing artwork
    const response = await request(app)
      .put(`/artworks/${nonExistingId}`)
      .send({});

    // Assertions
    expect(response.status).toBe(404);
  });

  /**
   * @description Test updating artwork with an invalid ID
   */
  test('should return 401 when updating with an invalid ID', async () => {
    /**
     * @type {string} invalidId - Invalid artwork ID
     */
    const invalidId = 'invalid_id'; // Invalid ID

    // Send a request to update the artwork with an invalid ID
    const response = await request(app)
      .put(`/artworks/${invalidId}`)
      .send({});

    // Assertions
    expect(response.status).toBe(401);
  });
});
