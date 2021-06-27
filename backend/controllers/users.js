const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const AuthorizationError = require('../errors/auth-err');
const ExistingDataError = require('../errors/existing-data-err');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Пользователь с указанным _id не найден.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Пользователь с указанным _id не найден.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      // eslint-disable-next-line no-shadow
      const { _id, email } = user;
      res.status(200).send({ _id, email });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ExistingDataError('Пользователь с указанным email уже существует.');
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные при создании пользователя.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      runValidators: true, // валидация данных
      new: true, // получаем в then обновлённую запись
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные при обновлении профиля.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      runValidators: true, // валидация данных
      new: true, // получаем в then обновлённую запись
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные при обновлении аватара.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      throw new AuthorizationError('Передан неверный логин или пароль.');
    })
    .catch(next);
};
