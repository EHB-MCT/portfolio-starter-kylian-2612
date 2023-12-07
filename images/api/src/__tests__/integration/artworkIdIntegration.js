// artworks.test.js

const request = require('supertest');
const app = require('./../../app.js'); 
const knexfile = require('./../../db/knexfile.js'); // Import your Knex configuration
const knex = require("knex")(knexfile.development)

const exampleArtist = {
  id: '1', 
  artist: 'van Gogh',
  uuid:'550e8400-e29b-41d4-a716-446655440000', 
  birthyear: '1853', 
  num_artworks: '300'
}
const exampleArtwork = {
  id: '1',
  title: 'Test Artwork',
  artist_uuid:'550e8400-e29b-41d4-a716-446655440000', 
  image_url:'https://example.com/image.jpg', 
  location_geohash:'9q8yy'
}

describe('GET /artworks/:id', () => {
  it('should return the correct artwork record', async () => {
    // Insert a test record into the database
   
    const response = await request(app)
      .get(`/artworks/${insertedRecord[0].id}`) // assuming the id is the first element in the array returned by insert
      .expect(200); // Assuming 200 is the expected status code

    // Add assertions based on your response format
    expect(response.body.title).toBe('Test Artwork');
    // Add more assertions based on your expected response

  });
  it('should return 404 when not exist', async () => {
    // Insert a test record into the database
    const response = await request(app)
      .get(`/artworks/-1`) // assuming the id is the first element in the array returned by insert
      .expect(404); // Assuming 200 is the expected status code

  });
  beforeAll(async () => {
    // Clean up: Delete the test record from the database after the test
    const insertedRecord = await knex('artworks').insert(exampleArtwork).returning("*");
    exampleArtwork.id = insertedRecord[0].id

  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await knex('artworks').where({ id: exampleArtwork.id}).del();
  });
});
