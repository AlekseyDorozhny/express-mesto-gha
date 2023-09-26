/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to db');
});

const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log('Сервер запустился');
});

app.use((req, res, next) => {
  req.user = {
    _id: '650ec4bd63095d359ddba6fa',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
