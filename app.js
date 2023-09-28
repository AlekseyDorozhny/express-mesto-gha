/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to db');
});

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log('Сервер запустился');
});

app.use((req, res, next) => {
  req.user = {
    _id: '650ec4bd63095d359ddba6fa',
  };
  next();
});

app.use('/', require('./routes/index'));
