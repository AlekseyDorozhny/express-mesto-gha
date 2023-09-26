/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const errorHandle = (err, res) => {
  if (err.name === 'CastError') {
    res.status(404).send({ message: 'Неправильный id' });
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Данные введены неправильно' });
  }
  res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorHandle(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((cards) => res.send(cards))
    .catch((err) => errorHandle(err, res));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, owner, likes, createdAt,
  } = req.body;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => errorHandle(err, res));
};

module.exports.likeCard = ((req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => res.send(card))
  .catch((err) => errorHandle(err, res))
);

module.exports.dislikeCard = ((req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => res.send(card))
  .catch((err) => errorHandle(err, res))
);
