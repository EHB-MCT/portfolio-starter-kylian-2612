const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexConfig = require('./knexfile');

const app = express();
const db = knex(knexConfig.development);

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
