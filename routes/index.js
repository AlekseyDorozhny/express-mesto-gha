/* eslint-disable no-unused-vars */
const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

router.use('*', auth, (req, res) => {
  throw new NotFoundError('Страницы не существует');
});

module.exports = router;
