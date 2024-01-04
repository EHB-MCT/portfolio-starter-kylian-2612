// app.js
const express = require('express');
const bodyParser = require('body-parser');

const knex = require('./db/knexfile'); 

const app = express();

app.use(bodyParser.json());

const artworksRouter = require('./routes/artworks.js');
app.use('/artworks', artworksRouter);

const artistRouter = require('./routes/artists.js');
app.use('/artists', artistRouter);

module.exports = app;
