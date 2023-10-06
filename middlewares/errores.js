/* eslint-disable no-console */
const BadRequestError = require('../errors/BadRequestError'); // 400
const WrongAuth = require('../errors/WrongAuth'); // 401
const NotEnoughRightsError = require('../errors/NotEnoughRightsError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictingRequestError = require('../errors/ConflictingRequestError'); // 409
const DefaultError = require('../errors/defaultError'); // 500

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.log(err.code);
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Данные введены неправильно' });
    return;
  }
  if (err.code === 401) {
    res.status(401).send({ message: err.message });
    return;
  }
  if (err.code === 403) {
    res.status(NotEnoughRightsError.code).send({ message: 'Нельзя удалять карточку другого пользователя' });
    return;
  }
  if (err.name === 'DocumentNotFoundError') {
    res.status(NotFoundError.code).send({ message: 'Запрошенный объект не найден' });
    return;
  }
  if (err.code === 11000) {
    res.status(ConflictingRequestError.code).send({ message: 'Данный Email уже зарегестрирован' });
    return;
  }
  res.status(DefaultError.code).send({ message: 'Произошла ошибка' });
};
