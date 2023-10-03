/* eslint-disable no-console */
const badRequestError = 400;
const wrongAuth = 401;
const notEnoughRightsError = 403;
const notFoundError = 404;
const conflictingRequestError = 409;
const defaultError = 500;

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // console.log(err);
  if (err.name === 'DocumentNotFoundError') {
    res.status(notFoundError).send({ message: 'Запрошенный объект не найден' });
    return;
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(badRequestError).send({ message: 'Данные введены неправильно' });
    return;
  }
  if (err.code === 403) {
    res.status(notEnoughRightsError).send({ message: 'Нельзя удалять карточку другого пользователя' });
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
