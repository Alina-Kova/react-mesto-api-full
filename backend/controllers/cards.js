const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные при создании карточки.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка с указанным _id не найдена.');
        return next(error);
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new IncorrectDataError('Не возможно удалить карточку, она создана другим пользователем.');
      }
      Card.findByIdAndDelete(req.params.id)
        .then((cardRemoval) => {
          res.send({ data: cardRemoval });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new IncorrectDataError('Переданы некорректные данные при удалении карточки.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new IncorrectDataError('Переданы некорректные данные для постановки лайка.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new IncorrectDataError('Переданы некорректные данные для снятия лайка.');
        return next(error);
      }
      return next(err);
    });
};
