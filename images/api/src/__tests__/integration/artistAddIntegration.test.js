// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const knex = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist here

describe('POST /artists/:id', () => {

  beforeAll(async () => {
    try {
      // Create a new UUID for the artist
      const ARTISTUUID = uuidv4();
      exampleArtist = {
        uuid: ARTISTUUID,
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        num_artworks: 20
      };

      // Insert the artist
      insertedArtist = await knex('artists').insert(exampleArtist).returning("*");

      // Define exampleArtwork using the insertedArtist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: instertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };

      // Insert the artwork
      insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;

      console.log('Inserted Artist:', insertedArtist);
      console.log('Example Artwork:', exampleArtwork);
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up: Delete the test record from the database after the test
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex('artists').where({ id: exampleArtist.id }).del();
      await knex.destroy();
    } catch (error) {
      console.log(error);
    }
  });

  
  test('should get all artists', async () => {
    const response = await request(app).get('/artists');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test('should get a single artist by ID', async () => {
    const response = await request(app).get(`/artists/${insertedArtist[0].id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(insertedArtist[0].id);
    expect(response.body.artist).toBe(insertedArtist[0].artist);
  });

  test('should return 404 for non-existent artist ID', async () => {
    const response = await request(app).get('/artists/9999999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Artist not found');
  });

  test('should return 401 for negative artist ID', async () => {
    const response = await request(app).get('/artists/-1');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('negative id provided');
  });

});