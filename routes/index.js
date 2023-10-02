const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const notFoundError = 404;

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.post('/signin', login);
router.post('/signup', createUser);

router.use('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Страницы не существует' });
});

module.exports = router;
