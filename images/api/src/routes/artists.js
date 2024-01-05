const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('./../db/knexfile');

const db = knex(knexConfig.development);

// Create a new artist
router.post('/', (req, res) => {
  const { artist, uuid, birthyear, num_artworks } = req.body;

  db('artists')
    .insert({ artist, uuid, birthyear, num_artworks })
    .returning('*')
    .then((insertedData) => {
      const insertedArtist = insertedData[0];
      res.status(201).json({
        message: 'Artist created successfully',
        artist: insertedArtist,
      });
    })
    .catch((error) => res.status(500).json({ error }));
});

// Retrieve all artists
router.get('/', (req, res) => {
  db('artists')
    .select()
    .then((artists) => res.json(artists))
    .catch((error) => res.status(500).json({ error }));
});

// Read One artist
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (id >= 0 && typeof (id) == 'number' && id < 99999999) {
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
    res.status(401).send({ message: "negative id provided" });
  }
});

// Update an artist
router.put('/:id', async(req, res) => {
  const { artist, uuid, birthyear, num_artworks } = req.body;
  const id = req.params.id;

  if (id < 0) {
    return res.status(401).json({ message: 'negative id provided' });
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


// Delete an artist
router.delete('/:id', async (req, res) => {
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

    await db('artists').where({ id }).del();
    res.send('Artist deleted successfully');
  } catch (error) {
    res.status(500).json({ error });
  }
});


module.exports = router;
