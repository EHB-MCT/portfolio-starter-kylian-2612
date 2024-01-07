// app.js

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./db/knexfile');
const artworksRouter = require('./routes/artworks');
const artistRouter = require('./routes/artists');

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Routes for artworks
/**
 * Middleware for handling artworks-related routes.
 * @type {express.Router}
 */
app.use('/artworks', artworksRouter);

// Routes for artists
/**
 * Middleware for handling artists-related routes.
 * @type {express.Router}
 */
app.use('/artists', artistRouter);

// Export the Express application instance
module.exports = app;
