/* eslint-disable no-console */
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to db');
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log('Сервер запустился');
});

app.use('/', require('./routes/index'));
