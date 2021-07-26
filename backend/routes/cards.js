const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(w{3})?\.?[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]#?/),
  }),
}), createCard);

router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), deleteCard);

router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), likeCard);

router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), dislikeCard);

module.exports = router;
