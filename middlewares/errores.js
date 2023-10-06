/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Данные введены неправильно' });
    return;
  }
  if (err.code === 401) {
    res.status(err.code).send({ message: err.message });
    return;
  }
  if (err.code === 403) {
    res.status(err.code).send({ message: 'Нельзя удалять карточку другого пользователя' });
    return;
  }
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Запрошенный объект не найден' });
    return;
  }
  if (err.code === 11000) {
    res.status(409).send({ message: 'Данный Email уже зарегестрирован' });
    return;
  }
  res.status(500).send({ message: 'Произошла ошибка' });
};
