const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const notFoundError = 404;

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      title: Joi.string().required().min(2).max(30),
      text: Joi.string().required().min(2),
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
      avatar: Joi.string().min(2).max(30).pattern(/^(http|https):\/\/[^ "]+$/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

router.use('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Страницы не существует' });
});

module.exports = router;
