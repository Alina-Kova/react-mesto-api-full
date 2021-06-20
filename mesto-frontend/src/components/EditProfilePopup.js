import React from 'react';
import { PopupWithForm } from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function EditProfilePopup(props) {
  // Создаем стейт-переменные
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);


  // Обработчик формы редактирования инфо о пользователе
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  // Обработчик поля ввода имени пользователя
  function handleNameUpdate(e) {
    setName(e.target.value)
  }

  //Обработчик поля ввода информации о пользователе
  function handleDescriptionUpdate(e) {
    setDescription(e.target.value)
  }

  return (
    <PopupWithForm isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} title="Редактировать профиль" buttonText="Сохранить" name="edit-profile">
      <input onChange={handleNameUpdate} value={name || ''} type="text" name="name" placeholder="Имя" className="popup__text popup__text_type_name"
        id="name-input" required minLength="2" maxLength="40" />
      <span className="popup__error" id="name-input-error"></span>
      <input onChange={handleDescriptionUpdate} value={description || ''} type="text" name="about" placeholder="Род деятельности"
        className="popup__text popup__text_type_occupation" id="occupation-input" required minLength="2"
        maxLength="400" />
      <span className="popup__error" id="occupation-input-error"></span>
    </PopupWithForm>
  )
}