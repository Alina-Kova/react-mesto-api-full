export default class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    //получение ответа с сервера
    _getResponseData(res) {
        //в случае ошибки
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        //если все корректно
        return res.json();
    }

    //получение информации о пользователе с сервера
    getPersonalInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: this._headers
        })
            .then(this._getResponseData);
    }

    //получение карточек пользователей с сервера
    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'GET',
            headers: this._headers
        })
            .then(this._getResponseData);
    }

    //отправка информации о пользователе на сервер
    showUserInfo(data) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then(this._getResponseData);
    }

    //добавление карточки
    addNewCard(data) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                link: data.link,
                name: data.name
            })
        })
            .then(this._getResponseData);
    }

    //добавление лайка/отображение кол-ва лайков у карточки
    showLikesNumber(cardId, isLiked) {
        if (isLiked) {
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: this._headers
        })
            .then(this._getResponseData);
    } else {
                return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._getResponseData);
    }
    }

    //удаление своей карточки
    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._getResponseData);
    }

    //удаление лайка/отображение кол-ва лайков у карточки
    unlikeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._getResponseData);
    }

    //изменение аватара
    editAvatar(data) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar
            })
        })
            .then(this._getResponseData);
    }
}

// let jwt = localStorage.getItem('jwt');

export const api = new Api({
	baseUrl: 'https://api.alina.mesto.nomoredomains.monster',
	headers: {
        // authorization: `${jwt}`,
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
		'Content-Type': 'application/json'
	}
})