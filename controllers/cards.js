/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
const Card = require('../models/card');

const notEnoughRightsError = new Error('Нельзя удалять карточку другого пользователя');
notEnoughRightsError.code = 403;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail()
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(notEnoughRightsError);
      }
    })
    .then(() => {
      return Card.findByIdAndRemove(req.params.cardId).orFail()
        .then((card) => res.send(card));
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.likeCard = ((req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((err) => next(err));
}
);

module.exports.dislikeCard = ((req, res, next) => {
  console.log(req.params.cardId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((err) => next(err));
}
);
