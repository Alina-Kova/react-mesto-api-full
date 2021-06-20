import React from 'react';
import { PopupWithForm } from './PopupWithForm.js';

export function EditAvatarPopup(props) {
  // Создаем реф
  const avatarChangeInput = React.useRef();

  // Обработчик формы обновления аватара
  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      // Присваиваем реф инпуту
      avatar: avatarChangeInput.current.value,
    });
  }

  return (
    <PopupWithForm isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} title="Обновить аватар" buttonText="Сохранить" name="avatar" >
      <div className="popup__input">
        <input ref={avatarChangeInput} type="url" name="link" placeholder="Ссылка на картинку"
          className="popup__text popup__text_type_avatar-link" id="url-input" required />
        <span className="popup__error" id="url-input-error"></span>
      </div>
    </PopupWithForm>
  )
}