// artworks.test.js

const request = require('supertest');
const app = require('./app.js'); 
const knex = require('./db/knexfile.js'); // Import your Knex configuration

describe('GET /artworks/:id', () => {
  it('should return the correct artwork record', async () => {
    // Insert a test record into the database
    const insertedRecord = await knex('artworks').insert({
      title: 'Test Artwork',
      // other fields...
    });

    const response = await request(app)
      .get(`/artworks/${insertedRecord[0]}`) // assuming the id is the first element in the array returned by insert
      .expect(200); // Assuming 200 is the expected status code

    // Add assertions based on your response format
    expect(response.body.title).toBe('Test Artwork');
    // Add more assertions based on your expected response
  });

  afterAll(async () => {
    // Clean up: Delete the test record from the database after the test
    await knex('artworks').where({ title: 'Test Artwork' }).del();
  });
});
