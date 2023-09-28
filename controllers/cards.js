/* eslint-disable no-console */
const Card = require('../models/card');

const defaultError = 500;
const notFoundError = 404;
const badRequestError = 400;

const errorHandle = (err, res) => {
  console.log(err.name);
  if (err.name === 'DocumentNotFoundError') {
    res.status(notFoundError).send({ message: 'Пользователь не найден' });
    return;
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(badRequestError).send({ message: 'Данные введены неправильно' });
    return;
  }
  res.status(defaultError).send({ message: 'Произошла ошибка' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorHandle(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((card) => res.send(card))
    .catch((err) => errorHandle(err, res));
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
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((err) => errorHandle(err, res));
}

);

module.exports.dislikeCard = ((req, res) => {
  console.log(req.params.cardId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((err) => errorHandle(err, res));
}
);
