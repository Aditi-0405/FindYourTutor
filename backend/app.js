const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connect');

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server started on port 5000');
  });
});

