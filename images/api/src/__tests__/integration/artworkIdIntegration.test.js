// artworks.test.js

const request = require('supertest');
const app = require('../../app.js'); 
const knexfile = require('../../db/knexfile.js'); // Import your Knex configuration
const knex = require("knex")(knexfile.development)
const { v4: uuidv4 } = require("uuid")

let insertedArtist
const artistUUID = uuidv4();
const exampleArtist = {
  artist: 'van Gogh',
  uuid: artistUUID, 
  birthyear: '1853', 
  num_artworks: '300'
}
let insertedRecord
const exampleArtwork = {
  title: 'Test Artwork',
  artist_uuid:artistUUID, 
  image_url:'https://example.com/image.jpg', 
  location_geohash:'9q8yy'
}

describe('GET /artworks/:id', () => {
  beforeAll(async () => {
    // Clean up: Delete the test record from the database after the test
    insertedArtist = await knex('artists').insert(exampleArtist).returning("*");
    insertedRecord = await knex('artworks').insert(exampleArtwork).returning("*");
    exampleArtist.id= insertedArtist[0].id
    exampleArtwork.id = insertedRecord[0].id

  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await knex('artworks').where({ id: exampleArtwork.id}).del();
    await knex('artists').where({id: exampleArtist.id}).del();
    await knex.destroy();
  });

  test('should return the correct artwork record', async () => {
    // Insert a test record into the database
    const artworkId = exampleArtwork.id
    const response = await request(app).get(`/artworks/${insertedRecord[0].id}`); 

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Artwork');

    const knexRecord = await knex('artworks').select("*").where("id", artworkId);
    expect(knexRecord.length).toBeGreaterThan(0); 
    expect(knexRecord[0]).toHaveProperty('id', artworkId);

  });
  test('should return 404 when not exist', async () => {
    // Insert a test record into the database
    const invalidArtworkId = 99999;
    const response = await request(app).get(`/artworks/${invalidArtworkId}`) 
    expect(response.status).toBe(404); 

    const knexRecord = await knex('artworks').select("*").where("id", invalidArtworkId);
    expect(knexRecord.length).toBe(0); 
  });

  test('should return 401 for a negative artworkID', async () => {
    // Insert a test record into the database
    const invalidArtworkId = -12;
    const response = await request(app).get(`/artworks/${invalidArtworkId}`) 
    expect(response.status).toBe(401); 
  });

  test('should return 401 for a string', async () => {
    // Insert a test record into the database
    const invalidArtworkId = "hello";
    const response = await request(app).get(`/artworks/${invalidArtworkId}`) 
    expect(response.status).toBe(401); 
  });

  test('should return 401 for a too large artworkID', async () => {
    // Insert a test record into the database
    const invalidArtworkId = 999999999;
    const response = await request(app).get(`/artworks/${invalidArtworkId}`) 
    expect(response.status).toBe(401); 
  });  
  
});
