/* eslint-disable no-console */
const User = require('../models/user');

const castError = new Error('Данные введены неправильно');
castError.name = 'CastError';

const errorHandle = (err, res) => {
  if (err.name === 'CastError') {
    res.status(404).send({ message: 'Пользователь не найден' });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Данные введены неправильно' });
    return;
  }
  res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports.getUsers = (req, res) => {
  console.log(req.params);
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorHandle(err, res));
};

module.exports.getUsersById = (req, res) => {
  if (typeof req.params.userId === 'string') {
    User.findById(req.params.userId)
      .then((user) => res.send(user))
      .catch((err) => errorHandle(err, res));
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.params;
  if (name.lenght < 2 || about.lenght < 2 || name.lenght > 30 || about.lenght > 30) {
    throw castError;
  }
  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { avatar: req.params.avatar })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};
