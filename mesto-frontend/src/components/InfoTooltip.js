import React from 'react';

export function InfoTooltip(props) {
    return (
        <div className={`modal-box ${props.isOpen && 'modal-box_opened'}`}>
            <button className="modal-box__close-button" type="button" onClick={props.onClose}></button>
            <div className="modal-box__container">
                <div className={`modal-box__icon ${props.isSuccessful ? 'modal-box__icon_type_accepted' : 'modal-box__icon_type_declined'}`}></div>
                {props.isSuccessful 
                ? (<h2 className="modal-box__text">Вы успешно зарегистрировались!</h2>)
                : (<h2 className="modal-box__text">Что-то пошло не так! Попробуйте ещё раз.</h2>)
                }
            </div>
        </div>
    )
}