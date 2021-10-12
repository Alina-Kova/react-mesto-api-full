require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { handleCors } = require('./middlewares/cors');
// const cookieParser = require('cookie-parser');

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

// const corsOptions = {
//   origin: [
//     'http://localhost:3000',
//     'https://localhost:3000',
//     'https://alina.mesto.nomoredomains.monster',
//     'http://alina.mesto.nomoredomains.monster',
//     // 'https://api.alina.mesto.nomoredomains.monster',
//     // 'http://api.alina.mesto.nomoredomains.monster',

//   ],
//   credentials: true,
//   methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// //////////
// const corsOptions = {
//   origin: [
//     'http://localhost:3000',
//     'https://alina.mesto.nomoredomains.monster',
//     'http://alina.mesto.nomoredomains.monster',
//   ],
//   credentials: true,
// };

// // eslint-disable-next-line consistent-return
// app.use((req, res, next) => {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   // проверяем, что источник запроса есть среди разрешённых
//   if (corsOptions.includes(origin)) {
//     // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
//     res.header('Access-Control-Allow-Origin', '*');
//   }
//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   const requestHeaders = req.headers['access-control-request-headers'];
//   if (method === 'OPTIONS') {
//     // разрешаем кросс-доменные запросы любых типов (по умолчанию)
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     // разрешаем кросс-доменные запросы с этими заголовками
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // завершаем обработку запроса и возвращаем результат клиенту
//     return res.end();
//   }
//   next();
// });

// app.options('*', cors());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// app.use(cors(corsOptions));
app.use(handleCors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);
// app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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

app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// обработчики ошибок

// подключаем логгер ошибок
app.use(errorLogger);

// обрабатываем ошибку 404
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

// обработчик ошибок celebrate
app.use(errors());

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

// app.listen(PORT);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
