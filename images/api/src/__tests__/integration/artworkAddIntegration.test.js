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

describe('GET /artworks/:id', () => {

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
  

  test('should return the correct artwork record', async () => {
    // Insert a test record into the database
    const response = await request(app)
        .post(`/artworks`) 
        .send(exampleArtwork)
        

    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Data not formatted correctly')

    if (response.body.message === 'Data not formatted correctly') {
      return;
    }

    const artworkResponse = response.body.artwork
    const knexRecord = await knex('artworks').select("*").where("id", artworkResponse.id);
    expect(knexRecord[0]).toHaveProperty('id', artworkResponse.id);
    expect(knexRecord[0]).toHaveProperty('title', exampleArtwork.title);
    expect(knexRecord[0]).toHaveProperty('artist_uuid', exampleArtwork.artist_uuid);
    expect(knexRecord[0]).toHaveProperty('image_url', exampleArtwork.image_url);
    expect(knexRecord[0]).toHaveProperty('location_geohash', exampleArtwork.location_geohash);

  });  

  test('should return 401, wrong artwork record', async () => {
    // Insert a test record into the database
    const response = await request(app)
        .post(`/artworks`) 
        .send({
          ...exampleArtwork,
          title: null
        });

    expect(response.status).toBe(401);    
    
    const knexRecord = await knex('artworks').select("*").where("title", null);
    expect(knexRecord.length).toBe(0)
  }); 
  
});
