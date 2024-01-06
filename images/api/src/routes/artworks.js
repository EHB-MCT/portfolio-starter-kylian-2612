const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const knex = require('knex');
const { v4: uuidv4 } = require('uuid');

const { checkArtworkTitle } = require('../helpers/endpointHelpers.js');
const { checkArtworkImage } = require('../helpers/artworkImageEndpointHelpers.js');
const { checkArtworkLocation } = require('../helpers/artworkLocationEndpointHelpers.js');

const knexConfig = require('./../db/knexfile');

const db = knex(knexConfig.development);


// Create a new artwork
router.post('/', async (req, res) => {
  try {
    const { title, image_url, location_geohash } = req.body;

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
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve all artworks
router.get('/', (req, res) => {
    db('artworks')
      .select()
      .then((artworks) => res.json(artworks))
      .catch((error) => res.status(500).json({ error }));
  });
  
// Read One
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);  
    if (id >= 0 && typeof(id) == 'number' && id < 99999999){
      try {
        const artwork = await db('artworks').where({ id }).first();
        if (!artwork) {
          return res.status(404).json({ error: 'Artwork not found' });
        }
        res.json(artwork);
      }catch (err) {
        res.status(500).json({ error: 'Error retrieving artwork' });
      }
    } else{
      res.status(401).send({ message: "negative id provided"});
    }

    }); 

// Update an artwork
router.put('/:id', async(req, res) => {
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

// Delete an artwork
router.delete('/:id', (req, res) => {
  const artworkId = req.params.id;

  if (isNaN(artworkId) || artworkId < 0 || artworkId >= 9999999) {
    // Invalid ID provided
    return res.status(401).json({ error: 'Invalid ID provided' });
  }

  db('artworks')
    .where({ id: artworkId }) // Use artworkId here
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
