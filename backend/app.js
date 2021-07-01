require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// http://localhost:3000/users

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const corsOption = {
//   origin: [
//     'https://alina.mesto.nomoredomains.monster',
//     'https://api.alina.mesto.nomoredomains.monster',
//     'http://localhost:3000',
//   ],
//   credentials: true,
//   preflightContinue: false,
//   method: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD'],
//   allowedHeaders: ['origin', 'content-type', 'Authorization'],
// };

// app.use('*', cors(corsOption));

app.use(cors({
  origin: 'https://alina.mesto.nomoredomains.monster',
  credentials: true,
  allowedHeaders: 'cookie,content-type',
}));

app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов
app.use(auth);
app.use('/cards', cardsRoutes);
app.use('/users', usersRoutes);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(w{3})?\.?[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]#?/),
  }),
}), createUser);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок

// обработчик ошибок celebrate
app.use(errors());

// обрабатываем ошибку 404
app.use(() => {
  throw new NotFoundError('Карточка или пользователь не найден.');
});

app.use((req, res, next) => {
  next(new NotFoundError('Карточка или пользователь не найден.'));
});

// обрабатываем ошибку 500
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
