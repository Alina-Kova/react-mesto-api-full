// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const { errors, celebrate, Joi } = require('celebrate');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const cardsRoutes = require('./routes/cards');
// const usersRoutes = require('./routes/users');
// const { login, createUser } = require('./controllers/users');
// const { requestLogger, errorLogger } = require('./middlewares/logger');
// const auth = require('./middlewares/auth');
// const NotFoundError = require('./errors/not-found-err');

// // Слушаем 3000 порт
// const { PORT = 3000 } = process.env;

// // http://localhost:3000/users

// const app = express();

// app.use(cors({
//   origin: [
//     'https://alina.mesto.nomoredomains.monster',
//     'http://alina.mesto.nomoredomains.monster',
//     'http://localhost:3000',
//   ],
//   credentials: true,
// }));

// // подключаемся к серверу mongo
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(requestLogger); // подключаем логгер запросов

// app.use('/cards', auth, cardsRoutes);
// app.use('/users', auth, usersRoutes);

// // app.get('/crash-test', () => {
// //   setTimeout(() => {
// //     throw new Error('Сервер сейчас упадёт');
// //   }, 0);
// // });

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), login);

// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().pattern(/https?:\/\/(w{3})?\.?[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]#?/),
//   }),
// }), createUser);

// app.use(errorLogger); // подключаем логгер ошибок

// // обработчики ошибок

// // обработчик ошибок celebrate
// app.use(errors());

// // обрабатываем ошибку 404
// app.use('/', () => {
//   throw new NotFoundError('Карточка или пользователь не найден.');
// });

// // обрабатываем ошибку 500
// app.use((err, req, res, next) => {
//   // если у ошибки нет статуса, выставляем 500
//   const { statusCode = 500, message } = err;

//   res
//     .status(statusCode)
//     .send({
//       // проверяем статус и выставляем сообщение в зависимости от него
//       message: statusCode === 500
//         ? 'На сервере произошла ошибка'
//         : message,
//     });
//   next();
// });

// app.listen(PORT);


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(cors({
    origin: [
    'https://alina.mesto.nomoredomains.monster',
    'http://alina.mesto.nomoredomains.monster',
    'https://api.alina.mesto.nomoredomains.monster',
    'http://api.alina.mesto.nomoredomains.monster',
    'http://localhost:3000',
  ],
  credentials: true,
  allowedHeaders: '*',
  // origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// app.use(cors({
// Access-Control-Allow-Credentials: true,
// // Тут перечисляем наши заголовки
// Access-Control-Allow-Headers: *,
// // Перечисляем разрешённые методы
// Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS
// // Пишем домен с которого отправляем запрос
// Access-Control-Allow-Origin: https://yourdomain.ru
// }))

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);

app.use('/cards', cardsRoutes);
app.use('/users', usersRoutes);

app.use(errorLogger);

app.use('/', () => {
  // eslint-disable-next-line no-console
  console.log(33);
  throw new NotFoundError('Запрашиваемая страница не найдена.');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});