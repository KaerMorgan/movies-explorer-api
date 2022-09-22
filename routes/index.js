const express = require('express');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const {
  registrationValidation,
  loginValidation,
} = require('../middlewares/joi');

const router = express.Router();

router.post('/signin', loginValidation, login);
router.post('/signup', registrationValidation, createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует!'));
});

module.exports = router;
