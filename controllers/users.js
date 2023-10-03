/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

module.exports.login = (req, res, next) => {
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
    .catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId).orFail()
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).orFail()
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
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
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => next(err));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true, upsert: false },
  ).orFail()
    .then((user) => res.send(user))
    .catch((err) => next(err));
};
