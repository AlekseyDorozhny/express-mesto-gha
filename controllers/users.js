/* eslint-disable no-console */
const User = require('../models/user');

const errorHandle = (err, res) => {
  console.log(err.name);
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Пользователь не найден' });
    return;
  }
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Не верный id' });
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
  User.findById(req.params.userId).orFail()
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => errorHandle(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send(user))
    .catch((err) => errorHandle(err, res));
};
