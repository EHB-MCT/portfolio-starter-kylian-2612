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
  const { title, image_url, location_geohash } = req.body;
  const artist_uuid = uuidv4();

  if (checkArtworkTitle(title) && checkArtworkImage(image_url) && checkArtworkLocation(location_geohash)) {
    try {
      const insertedData = await db('artworks')
        .insert({ title, artist_uuid, image_url, location_geohash })
        .returning('*');

      const insertedArtwork = insertedData[0];
      res.status(201).json({
        message: 'Artwork created successfully',
        artwork: insertedArtwork,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(401).send({ message: 'Data not formatted correctly' });
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
router.put('/:id', (req, res) => {
  const { title, artist_uuid, image_url, location } = req.body;
  const id = req.params.id;

  db('artworks')
    .where({ id })
    .update({ title, artist_uuid, image_url, location })
    .then(() => res.send('Artwork updated successfully'))
    .catch((error) => res.status(500).json({ error }));
});

// Delete an artwork
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db('artworks')
    .where({ id })
    .del()
    .then(() => res.send('Artwork deleted successfully'))
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
