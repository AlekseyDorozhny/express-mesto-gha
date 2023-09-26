/* eslint-disable no-console */
const User = require('../models/user');

const errorHandle = (err, res) => {
  if (err.name === 'CastError') {
    res.status(404).send({ message: 'Пользователь не найден' });
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Данные введены неправильно' });
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
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { name: req.params.name, about: req.params.about })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { avatar: req.params.avatar })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};
