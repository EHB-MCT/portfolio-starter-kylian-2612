const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require('uuid');
const knexfile = require('../../db/knexfile.js');
const db = require('knex')(knexfile.development);

/**
 * @typedef {Object} Artist
 * @property {string} uuid - The UUID of the artist.
 * @property {string} artist - The name of the artist.
 * @property {number} birthyear - The birth year of the artist.
 * @property {number} num_artworks - The number of artworks created by the artist.
 */

/**
 * @typedef {Object} Artwork
 * @property {string} title - The title of the artwork.
 * @property {string} artist_uuid - The UUID of the artist associated with the artwork.
 * @property {string} image_url - The URL of the image representing the artwork.
 * @property {string} location_geohash - The geohash representing the location of the artwork.
 */

describe('Artwork End-to-End Tests', () => {
  let insertedArtist;
  let exampleArtist;
  let addedArtworkId;
  let addedArtistId;

  /**
   * Setup before all tests, adding an example artist to the database.
   */
  beforeAll(async () => {
    try {
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1455,
        num_artworks: 20,
      };

      insertedArtist = await db('artists').insert(exampleArtist).returning('*');
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  /**
   * Cleanup after all tests, deleting the example artist from the database.
   */
  afterAll(async () => {
    await db('artists').where({ uuid: insertedArtist[0].uuid }).del();
    await db.destroy();
  });

  /**
   * Test to add a new artwork via POST /artworks.
   * @param {Artwork} newArtwork - The artwork data to be added.
   */
  test('should add a new artwork via POST /artworks', async () => {
    const newArtwork = {
      title: 'New Artwork',
      artist_uuid: exampleArtist.uuid,
      image_url: 'https://example.com/new_artwork.jpg',
      location_geohash: 'u4pruydqqw44',
    };

    const postResponse = await request(app).post('/artworks').send(newArtwork);
    expect(postResponse.status).toBe(200);
    addedArtworkId = postResponse.body.artwork.id;
  });

  /**
   * Test to retrieve a specific artwork via GET /artworks/:id.
   */
  test('should retrieve a specific artwork via GET /artworks/:id', async () => {
    const getResponse = await request(app).get(`/artworks/${addedArtworkId}`);

    expect(getResponse.status).toBe(200);
    // Ensure that the response body has the expected structure
    expect(getResponse.body.id).toEqual(addedArtworkId);
  });

  /**
   * Test to update the artwork when valid data is provided.
   * @param {Artwork} updatedArtwork - The updated artwork data.
   */
  test('should update the artwork when valid data is provided', async () => {
    const updatedArtwork = {
      title: 'Updated Mona Lisa',
      artist_uuid: exampleArtist.uuid,
      image_url: 'https://example.com/updated_mona_lisa.jpg',
      location_geohash: 'u4pruydqqw44',
    };

    const response = await request(app)
      .put(`/artworks/${addedArtworkId}`)
      .send(updatedArtwork);

    expect(response.status).toBe(200);

    const updatedRecord = await db('artworks').select('*').where('id', addedArtworkId).first();
    expect(updatedRecord.title).toBe(updatedArtwork.title);
    expect(updatedRecord.image_url).toBe(updatedArtwork.image_url);
    expect(updatedRecord.location_geohash).toBe('u4pruydqqw44');
  });

  /**
   * Test to add a new artist via POST /artists.
   * @param {Artist} newArtist - The artist data to be added.
   */
  test('should add a new artist via POST /artists', async () => {
    const newArtist = {
      uuid: uuidv4(),
      artist: 'Vincent van Gogh',
      birthyear: 1853,
      num_artworks: 120,
    };

    const postResponse = await request(app).post('/artists').send(newArtist);
    expect(postResponse.status).toBe(200);
    addedArtistId = postResponse.body.artist.id;
  });

  /**
   * Test to retrieve a specific artist via GET /artists/:id.
   */
  test('should retrieve a specific artist via GET /artists/:id', async () => {
    const getResponse = await request(app).get(`/artists/${addedArtistId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toEqual(addedArtistId);
  });

  /**
   * Test to update the artist via PUT /artists/:id.
   * @param {Artist} updatedArtistData - The updated artist data.
   */
  test('should update the artist via PUT /artists/:id', async () => {
    const updatedArtistData = {
      uuid: uuidv4(),
      artist: 'Updated Test Artist',
      birthyear: 2000,
      num_artworks: 15,
    };

    const response = await request(app)
      .put(`/artists/${addedArtistId}`)
      .send(updatedArtistData);

    expect(response.status).toBe(200);

    const updatedResponse = await db('artists').select('*').where('id', addedArtistId).first();
    expect(updatedResponse.uuid).toBe(updatedArtistData.uuid);
    expect(updatedResponse.artist).toBe(updatedArtistData.artist);
    expect(updatedResponse.birthyear).toBe(updatedArtistData.birthyear);
    expect(updatedResponse.num_artworks).toBe(updatedArtistData.num_artworks);
  });

  /**
   * Test to delete the artist via DELETE /artists/:id.
   */
  test('should delete the artist via DELETE /artists/:id', async () => {
    const response = await request(app).delete(`/artists/${addedArtistId}`);
    expect(response.status).toBe(204);
  });

  /**
   * Test to delete the artwork via DELETE /artworks/:id.
   */
  test('should delete the artwork via DELETE /artworks/:id', async () => {
    const response = await request(app).delete(`/artworks/${addedArtworkId}`);
    expect(response.status).toBe(204);
  });
});
