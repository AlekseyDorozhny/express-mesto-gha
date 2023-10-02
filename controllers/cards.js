/* eslint-disable no-console */
const Card = require('../models/card');

const defaultError = 500;
const notFoundError = 404;
const badRequestError = 400;

const notEnoughRightsError = new Error('Нельзя удалять карточку другого пользователя');
notEnoughRightsError.code = 403;

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
  if (err.code === 403) {
    res.status(notEnoughRightsError.code).send({ message: err.message });
    return;
  }
  res.status(defaultError).send({ message: 'Произошла ошибка' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorHandler(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail()
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(notEnoughRightsError);
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId).orFail()
        .then((card) => res.send(card));
    })
    .catch((err) => errorHandler(err, res));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, owner = req.user._id, likes, createdAt,
  } = req.body;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => errorHandler(err, res));
};

module.exports.likeCard = ((req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((err) => errorHandler(err, res));
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
    .catch((err) => errorHandler(err, res));
}
);
