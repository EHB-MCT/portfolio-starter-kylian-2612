// app.js
const express = require('express');
const bodyParser = require('body-parser');
const artworksRouter = require('./routes/artworks.js');
const knex = require('./db/knexfile'); 

const app = express();

app.use(bodyParser.json());


app.use('/artworks', artworksRouter);

module.exports = app;
