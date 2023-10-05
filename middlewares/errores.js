/* eslint-disable no-console */
const badRequestError = new Error('Данные введены неправильно');
badRequestError.code = 400;

const wrongAuth = new Error('Неправильные почта или пароль');
wrongAuth.code = 401;

const notEnoughRightsError = new Error('Нельзя удалять карточку другого пользователя');
notEnoughRightsError.code = 403;

const notFoundError = new Error('Запрошенный объект не найден');
notFoundError.code = 404;

const conflictingRequestError = new Error('Данный Email уже зарегестрирован');
conflictingRequestError.code = 409;

const defaultError = new Error('Произошла ошибка');
defaultError.code = 500;

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // console.log(err);
  if (err.name === 'DocumentNotFoundError') {
    res.status(notFoundError.code).send({ message: notFoundError.message });
    return;
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(badRequestError.code).send({ message: badRequestError.message });
    return;
  }
  if (err.code === 403) {
    res.status(notEnoughRightsError.code).send({ message: notEnoughRightsError.message });
    return;
  }
  if (err.code === 11000) {
    res.status(conflictingRequestError.code).send({ message: conflictingRequestError.message });
    return;
  }
  if (err.code === 401) {
    res.status(wrongAuth.code).send({ message: err.message });
    return;
  }
  res.status(defaultError.code).send({ message: defaultError.message });
};
