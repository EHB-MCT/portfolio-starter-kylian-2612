const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../db/knexfile');
const { checkArtistName, checkArtistBirthyear, checkArtistNumArtworks } = require('../helpers/artistEndpointHelpers');

const db = knex(knexConfig.development);

/**
 * @route   POST /artists
 * @desc    Create a new artist
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
router.post('/', (req, res) => {
  /**
   * @type {string} artist - Artist name
   * @type {string} uuid - Artist UUID
   * @type {number} birthyear - Artist birth year
   * @type {number} num_artworks - Number of artworks by the artist
   */
  const { artist, uuid, birthyear, num_artworks } = req.body;

  // Check if required fields are present
  if (checkArtistName(artist) && checkArtistBirthyear(birthyear) && checkArtistNumArtworks(num_artworks)) {
    db('artists')
      .insert({ artist, uuid, birthyear, num_artworks })
      .returning('*')
      .then((insertedData) => {
        const insertedArtist = insertedData[0];
        res.status(200).json({
          message: 'Artist created successfully',
          artist: insertedArtist,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  } else {
    res.status(400).json({ error: 'Invalid data. Missing required fields.' });
  }
});

/**
 * @route   GET /artists
 * @desc    Retrieve all artists
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
router.get('/', (req, res) => {
  db('artists')
    .select()
    .then((artists) => res.json(artists))
    .catch((error) => res.status(500).json({ error }));
});

/**
 * @route   GET /artists/:id
 * @desc    Read one artist by ID
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
router.get('/:id', async (req, res) => {
  /**
   * @type {number} id - Artist ID
   */
  const id = parseInt(req.params.id);

  if (id >= 0 && typeof id === 'number' && id < 99999999) {
    try {
      const artist = await db('artists').where({ id }).first();
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      res.json(artist);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving artist' });
    }
  } else {
    res.status(401).json({ message: 'Invalid or negative ID provided' });
  }
});

/**
 * @route   PUT /artists/:id
 * @desc    Update an artist by ID
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
router.put('/:id', async (req, res) => {
  /**
   * @type {number} id - Artist ID
   * @type {string} artist - Artist name
   * @type {string} uuid - Artist UUID
   * @type {number} birthyear - Artist birth year
   * @type {number} num_artworks - Number of artworks by the artist
   */
  const { artist, uuid, birthyear, num_artworks } = req.body;
  const id = req.params.id;

  if (!Number.isInteger(Number(id)) || id < 0) {
    return res.status(401).json({ message: 'Invalid or negative ID provided' });
  }

  // Check if the artist exists
  const existingArtist = await db('artists').where({ id }).first();
  if (!existingArtist) {
    return res.status(404).json({ error: 'Artist not found' });
  }

  db('artists')
    .where({ id })
    .update({ artist, uuid, birthyear, num_artworks })
    .then(() => res.send('Artist updated successfully'))
    .catch((error) => res.status(500).json({ error }));
});

/**
 * @route   DELETE /artists/:id
 * @desc    Delete an artist by ID
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 */
router.delete('/:id', async (req, res) => {
  /**
   * @type {number} id - Artist ID
   */
  const id = req.params.id;

  // Check if the ID is valid
  if (id < 0) {
    return res.status(401).json({ error: 'Invalid ID provided' });
  }

  try {
    const artist = await db('artists').where({ id }).first();

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during this process' });
  }
});

module.exports = router;
