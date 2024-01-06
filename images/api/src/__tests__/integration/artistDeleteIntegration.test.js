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

describe('DELETE/artists/:id', () => {

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
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw44'
      };

      // Insert the artwork
      insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;


    } catch (error) {
      console.log("error")
    }
  });

  afterAll(async () => {
    try {
      // Clean up: Delete the test record from the database after the test
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex('artists').where({ uuid: exampleArtist.uuid }).del();
      await knex.destroy();
    } catch (error) {
      console.log("error");
    }
  });

  test('should return 401 if negative ID provided', async () => {
    const response = await request(app).delete('/artists/-1');
    expect(response.status).toBe(401);
    // You can also check the response body for a specific error message
  });

  test('should return 404 if artist not found', async () => {
    const nonExistentId = 999999; // Assuming this ID does not exist
    const response = await request(app).delete(`/artists/${nonExistentId}`);
    expect(response.status).toBe(404);
    // You can also check the response body for a specific error message
  });

  test('should delete an artist successfully', async () => {
    // Make a request to delete the artist using its ID
    const response = await request(app).delete(`/artists/${insertedArtist[0].id}`);
  
    // Check if the response status is 200 (OK)
    expect(response.status).toBe(200);
  
    // Check if the response body contains the success message
    expect(response.text).toBe('Artist deleted successfully');
  
    // Optionally, you can also check if the artist no longer exists in the database
    const deletedArtist = await knex('artists').where({ id: insertedArtist[0].id }).first();
    expect(deletedArtist).toBeUndefined();
  });

});

