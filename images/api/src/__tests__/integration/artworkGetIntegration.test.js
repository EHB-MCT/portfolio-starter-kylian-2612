// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const knex = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist; // Declare exampleArtist at a higher scope

describe('GET /artworks/:id', () => {
  
  beforeAll(async () => {
    try {
      // Define exampleArtist
      exampleArtist = {
        uuid: uuidv4(),
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        num_artworks: 20
      };

      // Insert the artist and get the inserted record
      insertedArtist = await knex('artists').insert(exampleArtist).returning("*");

      // Define exampleArtwork using the insertedArtist
      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw43'
      };

      // Insert the artwork and get the inserted record
      insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    // Uncomment the following lines when you are ready to implement the cleanup logic
    await knex('artworks').where({ id: exampleArtwork.id}).del();
    await knex('artists').where({uuid: exampleArtist.uuid}).del();
    await knex.destroy();
  });

  test('should return the correct artwork record', async () => {
    // Insert a test record into the database
    const artworkId = exampleArtwork.id
    const response = await request(app).get(`/artworks/${insertedRecord[0].id}`); 

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(exampleArtwork.title);

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
