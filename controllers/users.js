/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const defaultError = 500;
const notFoundError = 404;
const badRequestError = 400;
const conflictingRequestError = 409;
const wrongAuth = 401;

const errorHandler = (err, res) => {
  console.log(err);
  if (err.name === 'DocumentNotFoundError') {
    res.status(notFoundError).send({ message: 'Пользователь не найден' });
    return;
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(badRequestError).send({ message: 'Данные введены неправильно' });
    return;
  }
  if (err.code === 11000) {
    res.status(conflictingRequestError).send({ message: 'Данный Email уже зарегестрирован' });
    return;
  }
  if (err.code === 401) {
    res.status(wrongAuth).send({ message: err.message });
    return;
  }
  res.status(defaultError).send({ message: 'Произошла ошибка' });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => errorHandler(err, res));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorHandler(err, res));
};

module.exports.getUsersById = (req, res) => {
  console.log('usersbyid');
  User.findById(req.params.userId).orFail()
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id).orFail()
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = User.create({
        name, about, avatar, email, password: hash,
      });
      return user;
    })
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};
