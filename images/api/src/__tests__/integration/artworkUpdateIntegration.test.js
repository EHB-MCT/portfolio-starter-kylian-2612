// artworks.test.js
const request = require('supertest');
const app = require('../../app.js');
const { v4: uuidv4 } = require("uuid");
const knexfile = require('../../db/knexfile.js');
const knex = require("knex")(knexfile.development);

let insertedArtist;
let insertedRecord;
let exampleArtwork;
let exampleArtist;

describe('UPDATE /artworks/:id', () => {

  beforeAll(async () => {
    try {
      const ARTIST_UUID = uuidv4();
      exampleArtist = {
        uuid: ARTIST_UUID,
        artist: 'Leonardo da Vinci',
        birthyear: 1452,
        num_artworks: 20
      };

      insertedArtist = await knex('artists').insert(exampleArtist).returning("*");

      exampleArtwork = {
        title: 'Mona Lisa',
        artist_uuid: insertedArtist[0].uuid,
        image_url: 'https://example.com/mona_lisa.jpg',
        location_geohash: 'u4pruydqqw44'
      };

      insertedRecord = await knex('artworks').insert({ ...exampleArtwork }).returning("*");
      exampleArtwork.id = insertedRecord[0].id;

    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      await knex('artworks').where({ id: exampleArtwork.id }).del();
      await knex('artists').where({ uuid: exampleArtist.uuid }).del();
      await knex.destroy();
    } catch (error) {
      console.error(error);
    }
  });

  test('should update the artwork when valid data is provided', async () => {
    const updatedArtwork = {
      id: exampleArtwork.id,
      title: 'Updated Mona Lisa',
      artist_uuid: exampleArtwork.artist_uuid,
      image_url: 'https://example.com/updated_mona_lisa.jpg',
      location_geohash: 'u4pruydqqw44',
    };

    const artistExists = await knex('artists').where('uuid', updatedArtwork.artist_uuid).first();

    if (!artistExists) {
      const newArtist = {
        uuid: updatedArtwork.artist_uuid,
        artist: 'New Artist',
        birthyear: 2000,
        num_artworks: 0,
      };

      await knex('artists').insert(newArtist);
    }

    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(updatedArtwork);

    expect(response.status).toBe(200);

    const knexRecord = await knex('artworks').select('*').where('id', updatedArtwork.id);
    expect(knexRecord.length).toBe(1);

    const updatedRecord = knexRecord[0];
    expect(updatedRecord.title).toBe(updatedArtwork.title);
    expect(updatedRecord.image_url).toBe(updatedArtwork.image_url);
    expect(updatedRecord.location_geohash).toBe('u4pruydqqw44');
  });

  test('should return 200 when invalid data is provided', async () => {
    const invalidArtwork = {
      title: '', // Invalid title
      artist_uuid: uuidv4(), // Invalid artist_uuid
      image_url: 'https://example.com/invalid_image.jpg',
      location_geohash: 'invalid_hash',
    };

    const validArtist = {
      uuid: invalidArtwork.artist_uuid,
      artist: 'Valid Artist',
      birthyear: 2000,
      num_artworks: 0,
    };

    await knex('artists').insert(validArtist);

    const response = await request(app)
      .put(`/artworks/${exampleArtwork.id}`)
      .send(invalidArtwork);

    expect(response.status).toBe(200);
  });

  test('should return 404 when updating non-existing artwork', async () => {
    const nonExistingId = 999999; // Non-existing ID

    const response = await request(app)
      .put(`/artworks/${nonExistingId}`)
      .send({});

    expect(response.status).toBe(404);
  });

  test('should return 401 when updating with an invalid ID', async () => {
    const invalidId = 'invalid_id'; // Invalid ID

    const response = await request(app)
      .put(`/artworks/${invalidId}`)
      .send({});

    expect(response.status).toBe(401);
  });
});
