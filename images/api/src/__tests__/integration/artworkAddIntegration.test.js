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

describe('POST /artworks/:id', () => {

  beforeAll(async () => {
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
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };

  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await knex('artists').where({ id: insertedArtist[0].id }).del();
    await knex.destroy();
  });

  test('should create artwork with valid data', async () => {
    // Send a POST request with valid artwork data
    const response = await request(app)
      .post('/artworks')
      .send({
        title: 'Starry Night',
        image_url: 'https://example.com/starry_night.jpg',
        location_geohash: 'u4pruydqqw43',
      });

    // Assert that the response status is 200
    expect(response.status).toBe(200);

    // Assert that the response contains the expected message and artwork details
    expect(response.body.message).toBe('Artwork created successfully');
    expect(response.body.artwork.title).toBe('Starry Night');
    expect(response.body.artwork.image_url).toBe('https://example.com/starry_night.jpg');
    expect(response.body.artwork.location_geohash).toBe('u4pruydqqw43');
  });

  test('should not create artwork with invalid data', async () => {
    // Send a POST request with invalid artwork data (missing required fields)
    const response = await request(app)
      .post('/artworks')
      .send({
        // Missing required fields: title, image_url, location_geohash
      });

    // Assert that the response status is 500 (Internal Server Error)
    expect(response.status).toBe(500);

    // Assert that the response contains an error message
    expect(response.body.error).toBe('Internal Server Error');
  });

  test('should return 401, wrong artwork record', async () => {
    // Send a GET request to the endpoint with an invalid ID
    const response = await request(app)
      .get(`/artworks/invalid_id`);
    // Check the response status
    expect(response.status).toBe(401);
  });
  


 
  
});
