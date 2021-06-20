import React from 'react';
import { Card } from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__section">
          <div className="profile__avatar-section">
            <img src={currentUser.avatar} alt="фото профиля" className="profile__avatar" onClick={props.onEditAvatar} />
          </div>
          <div className="profile__info">
            <div className="profile__container">
              <h1 id="name" className="profile__name">{currentUser.name}</h1>
              <button className="profile__edit-button" type="button" onClick={props.onEditProfile} />
            </div>
            <p id="description" className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button className="profile__add-button" type="button" onClick={props.onAddPlace} />
      </section>

      <section className="elements">
        <ul className="elements__list">
          {props.cards.map(card => {
            return (<Card
              card={card}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
              key={card._id}
              link={card.link}
              name={card.name}
              likes={card.likes.length}
            />
            )
          })}
        </ul>
      </section>
    </main>
  )
}