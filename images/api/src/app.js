// app.js
const express = require('express');
const bodyParser = require('body-parser');
const artworksRouter = require('./routes/artworks.js');
const knex = require('./db/knexfile'); 

const app = express();

app.use(bodyParser.json());

// Add any other middleware or configuration you need

// Mount the artworks router
app.use('/artworks', artworksRouter);

module.exports = app;
