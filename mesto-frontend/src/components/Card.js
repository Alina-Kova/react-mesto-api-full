import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;
  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `elements__delete ${isOwn ? 'elements__delete_visible' : ''}`);
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (`elements__like ${isLiked ? 'elements__like_active' : ''}`);

  //обработчик клика по картинке в карточке
  function handleClick() {
    props.onCardClick(props.card);
  }

  //обработчик клика по кнопке лайка
  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  //обработчик клика по кнопке удаления карточки в карточке
  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <li className="elements__card">
      <button onClick={handleDeleteClick} className={cardDeleteButtonClassName} type="button"></button>
      <img src={props.link} className="elements__photo" alt={props.name} onClick={handleClick} />
      <div className="elements__caption">
        <h2 className="elements__card-name">{props.card.name}</h2>
        <div className="elements__like-section">
          <button onClick={handleLikeClick} className={cardLikeButtonClassName} type="button"></button>
          <span className="elements__like-count">{props.card.likes.length}</span>
        </div>
      </div>
    </li>
  )
}