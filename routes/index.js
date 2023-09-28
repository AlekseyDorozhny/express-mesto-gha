const router = require('express').Router();

const notFoundError = 404;

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => {
  res.status(notFoundError).send({ message: 'Страницы не существует' });
});

module.exports = router;
