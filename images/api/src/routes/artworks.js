const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const knex = require('knex');
const { v4: uuidv4 } = require('uuid');
const { checkArtworkTitle, checkArtworkImage, checkArtworkLocation } = require('../helpers/artworkEndpointHelpers.js');
const knexConfig = require('./../db/knexfile');

const db = knex(knexConfig.development);

/**
 * @route   POST /api/artworks
 * @desc    Create a new artwork
 * @access  Public
 * 
 * @param   {string} title - The title of the artwork.
 * @param   {string} image_url - URL of the artwork image.
 * @param   {string} location_geohash - Geohash representing the location of the artwork.
 */
router.post('/', async (req, res) => {
  const { title, image_url, location_geohash } = req.body;

  if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
    // Generate a UUID for the artist
    const artist_uuid = uuidv4();

    // Insert the artist into the "artists" table
    await db('artists').insert({ uuid: artist_uuid });

    // Insert the artwork into the "artworks" table
    const insertedData = await db('artworks')
      .insert({ title, artist_uuid, image_url, location_geohash })
      .returning(['id', 'title', 'artist_uuid', 'image_url', 'location_geohash']);

    const insertedArtwork = insertedData[0];

    res.status(200).json({
      message: 'Artwork created successfully',
      artwork: insertedArtwork,
    });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route   GET /api/artworks
 * @desc    Retrieve all artworks
 * @access  Public
 */
router.get('/', (req, res) => {
  db('artworks')
    .select()
    .then((artworks) => res.json(artworks))
    .catch((error) => res.status(500).json({ error }));
});

/**
 * @route   GET /api/artworks/:id
 * @desc    Retrieve a specific artwork by ID
 * @access  Public
 * 
 * @param   {number} id - The ID of the artwork.
 */
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (id >= 0 && typeof id === 'number' && id < 99999999) {
    try {
      const artwork = await db('artworks').where({ id }).first();

      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      res.json(artwork);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving artwork' });
    }
  } else {
    res.status(401).send({ message: 'Negative ID provided' });
  }
});

/**
 * @route   PUT /api/artworks/:id
 * @desc    Update an artwork by ID
 * @access  Public
 * 
 * @param   {number} id - The ID of the artwork.
 * @param   {string} title - The updated title of the artwork.
 * @param   {string} artist_uuid - The updated UUID of the artist associated with the artwork.
 * @param   {string} image_url - The updated URL of the artwork image.
 * @param   {string} location - The updated location of the artwork.
 */
router.put('/:id', async (req, res) => {
  const { title, artist_uuid, image_url, location } = req.body;
  const id = req.params.id;

  if (!Number.isInteger(Number(id))) {
    return res.status(401).send({ message: 'Invalid artwork ID' });
  }

  try {
    const existingArtwork = await db('artworks').where({ id }).first();

    if (!existingArtwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    await db('artworks')
      .where({ id })
      .update({ title, artist_uuid, image_url, location });

    res.status(200).send('Artwork updated successfully');
  } catch (error) {
    console.log('Error updating artwork:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route   DELETE /api/artworks/:id
 * @desc    Delete an artwork by ID
 * @access  Public
 * 
 * @param   {number} id - The ID of the artwork to be deleted.
 */
router.delete('/:id', (req, res) => {
  const artworkId = req.params.id;

  if (isNaN(artworkId) || artworkId < 0 || artworkId >= 9999999) {
    // Invalid ID provided
    return res.status(401).json({ error: 'Invalid ID provided' });
  }

  db('artworks')
    .where({ id: artworkId })
    .del()
    .then((deletedCount) => {
      if (deletedCount > 0) {
        // Artwork deleted successfully
        res.status(204).send();
      } else {
        // Artwork not found, return 404
        res.status(404).json({ error: 'Artwork not found' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
