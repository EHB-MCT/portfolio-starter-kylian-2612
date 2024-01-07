const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const knex = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

/**
 * @description Set up necessary data for testing DELETE /artworks/:id endpoint.
 * @beforeAll
 */
describe('DELETE /artworks/:id', () => {
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
        location_geohash: 'u4pruydqqw43'
      };

      // Insert the artwork
      insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });

  /**
   * @description Clean up: Delete the test record from the database after the test.
   * @afterAll
   */
  afterAll(async () => {
    try{
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex('artists').where({ uuid: exampleArtist.uuid }).del();
      await knex.destroy();
    } catch(error){
      console.log('error', error);
    }
  });

  /**
   * @description Test if the artwork is deleted when a valid ID is provided.
   * @test
   */
  test('should delete the artwork when a valid ID is provided', async () => {
    const response = await request(app).delete(`/artworks/${exampleArtwork.id}`);

    expect(response.status).toBe(204);

    const knexRecord = await knex("artworks").select("*").where("id", exampleArtwork.id);

    expect(knexRecord.length).toBe(0);
  });

  /**
   * @description Test if 404 is returned when trying to delete a non-existing artwork.
   * @test
   */
  test('should return 404 when trying to delete a non-existing artwork', async () => {
    const response = await request(app).delete(`/artworks/${exampleArtwork.id}`);

    expect(response.status).toBe(404);
  });

  /**
   * @description Test if 401 is returned when trying to delete with an invalid ID.
   * @test
   */
  test('should return 401 when trying to delete with an invalid ID', async () => {
    const response = await request(app).delete(`/artworks/invalid_id`);

    expect(response.status).toBe(401);
  });
});
