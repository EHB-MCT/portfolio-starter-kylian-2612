const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const db = knex(knexConfig.development);

app.use(bodyParser.json());

// Create a new artwork
app.post('/artworks', (req, res) => {
    const { title, artist_uuid, image_url, location } = req.body;
    db('artworks')
      .insert({ title, artist_uuid, image_url, location })
      .then(() => res.status(201).send('Artwork created successfully'))
      .catch((error) => res.status(500).json({ error }));
  });

  // Retrieve all artworks
app.get('/artworks', (req, res) => {
    db('artworks')
      .select()
      .then((artworks) => res.json(artworks))
      .catch((error) => res.status(500).json({ error }));
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
