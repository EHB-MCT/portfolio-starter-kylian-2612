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

describe('POST /artworks/:id', () => {
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
    const response = await request(app)
        .post(`/artworks`) 
        .send(exampleArtwork)

    const artworkResponse = response.body.artwork
    expect(response.status).toBe(201);

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
