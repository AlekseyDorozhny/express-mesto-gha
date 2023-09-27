/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('mongoose').Types;
const Card = require('../models/card');

const errorHandle = (err, res) => {
  console.log(err.name);
  if (err.name === 'CastError') {
    res.status(404).send({ message: 'Неправильный id' });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Данные введены неправильно' });
    return;
  }
  res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorHandle(err, res));
};

module.exports.deleteCard = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (card === null) {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch((err) => errorHandle(err, res));
    return;
  }
  res.status(400).send({ message: 'Данные введены неправильно' });
};

module.exports.createCard = (req, res) => {
  const {
    name, link, owner = req.user._id, likes, createdAt,
  } = req.body;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => errorHandle(err, res));
};

module.exports.likeCard = ((req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card === null) {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch((err) => errorHandle(err, res));
    return;
  }
  res.status(400).send({ message: 'Данные введены неправильно' });
}

);

module.exports.dislikeCard = ((req, res) => {
  console.log(req.params.cardId);
  if (ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card === null) {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch((err) => errorHandle(err, res));
    return;
  }
  res.status(400).send({ message: 'Данные введены неправильно' });
}
);
