// app.js

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./db/knexfile');
const artworksRouter = require('./routes/artworks');
const artistRouter = require('./routes/artists');

const app = express();

app.use(bodyParser.json());
app.use('/artworks', artworksRouter);
app.use('/artists', artistRouter);

module.exports = app;
