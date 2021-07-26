const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUserById, getMe, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/me', getMe);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(w{3})?\.?[0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]#?/),
  }),
}), updateAvatar);

module.exports = router;
