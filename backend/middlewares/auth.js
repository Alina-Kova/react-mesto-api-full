const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/auth-err');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  // const { authorization } = req.headers;
  const token = req.cookies.jwt;

  // // убеждаемся, что он есть или начинается с Bearer
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   throw new AuthorizationError('Необходима авторизация');
  // }

  // // извлечём токен
  // const token = authorization.replace('Bearer ', '');

  // if (!token) {
  //   throw new AuthorizationError('Необходима авторизация');
  // }

  let payload;

  try {
    if (!token) {
      throw new AuthorizationError('Необходима авторизация');
    }
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
  return true;
};
