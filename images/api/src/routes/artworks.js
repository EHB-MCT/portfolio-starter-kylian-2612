const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { checkArtworkTitle} = require("../helpers/endpointHelpers.js")
const knex = require('knex');
const knexConfig = require('./db/knexfile');

const db = knex(knexConfig.development);


// Create a new artwork
router.post('/artworks', (req, res) => {
    const { title, artist_uuid, image_url, location } = req.body;
    if(checkArtworkTitle(artwork.title)) {
      db('artworks')
        .insert({ title, artist_uuid, image_url, location })
        .then(() => res.status(201).json({message: 'Artwork created successfully'}))
        .catch((error) => res.status(500).json({ error }));

    } else {
      res.status(401).send({ message: "title not formatted correctly"});
    }

});


// Retrieve all artworks
router.get('/artworks', (req, res) => {
    db('artworks')
      .select()
      .then((artworks) => res.json(artworks))
      .catch((error) => res.status(500).json({ error }));
  });
  
// Read One
router.get('/artworks/:id', async (req, res) => {
    const id = req.params.id;  
    try {
        const artwork = await db('artworks').where({ id }).first();
        if (!artwork) {
          return res.status(404).json({ error: 'Artwork not found' });
        }
        res.json(artwork);
      } catch (err) {
        res.status(500).json({ error: 'Error retrieving artwork' });
      }
    }); 

// Update an artwork
router.put('/artworks/:id', (req, res) => {
  const { title, artist_uuid, image_url, location } = req.body;
  const id = req.params.id;

  db('artworks')
    .where({ id })
    .update({ title, artist_uuid, image_url, location })
    .then(() => res.send('Artwork updated successfully'))
    .catch((error) => res.status(500).json({ error }));
});

// Delete an artwork
router.delete('/artworks/:id', (req, res) => {
  const id = req.params.id;

  db('artworks')
    .where({ id })
    .del()
    .then(() => res.send('Artwork deleted successfully'))
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
