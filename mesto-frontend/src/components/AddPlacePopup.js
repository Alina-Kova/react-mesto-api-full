import React from 'react';
import { PopupWithForm } from './PopupWithForm.js';

export function AddPlacePopup(props) {
    // Создаем стейт-переменные
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    // Обработчик формы добаления новой карточки
    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onAddPlace({ link, name });
    }

    //Обработчик поля ввода имени каточки
    function handleCardNameChange(e) {
        setName(e.target.value)
    }

    //Обработчик поля ввода ссылки на картинку
    function handleLinkChange(e) {
        setLink(e.target.value)
    }

    return (
        <PopupWithForm onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose} title="Новое место" buttonText="Создать" name="add-card">
            <input onChange={handleCardNameChange}
                type="text" name="name" placeholder="Название"
                className="popup__text popup__text_type_place" id="name" required minLength="2"
                maxLength="30" />
            <span className="popup__error place-input-error" id="place-input-error"></span>
            <input onChange={handleLinkChange}
                type="url" name="link" placeholder="Ссылка на картинку"
                className="popup__text popup__text_type_link" id="link" required />
            <span className="popup__error" id="link-input-error"></span>
        </PopupWithForm>
    )
}