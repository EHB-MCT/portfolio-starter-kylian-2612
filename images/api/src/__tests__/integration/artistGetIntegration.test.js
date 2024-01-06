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

describe('GET/artists/:id', () => {

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

  it('should get all artists', async () => {
    const response = await request(app).get('/artists');
  
    expect(response.status).toBe(200);
    const leonardoArtist = response.body.find(artist => artist.artist === 'Leonardo da Vinci');
    expect(leonardoArtist).toBeDefined(); // Expect 'Leonardo da Vinci' to be present
  });  

  it('should get a specific artist by ID', async () => {
    const response = await request(app).get(`/artists/${insertedArtist[0].id}`);
  
    expect(response.status).toBe(200);
    expect(response.body.artist).toBe('Leonardo da Vinci');
  });

  it('should return an error for invalid artist ID', async () => {
    const invalidID = 999999; // Assuming this ID does not exist in your database
    const response = await request(app).get(`/artists/${invalidID}`);
  
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Artist not found');
  });

  it('should return an error for negative artist ID', async () => {
    const negativeID = -1;
    const response = await request(app).get(`/artists/${negativeID}`);
  
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('negative id provided');
  });
  
});

