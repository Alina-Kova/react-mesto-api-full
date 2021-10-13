export default class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _getResponseData(res) {
        //в случае ошибки
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        //если все корректно
        return res.json();
    }

    //передаем массив с данными пользователя и имеющимися карточками методу Promise.all
    getData(token) {
        return Promise.all([this.getPersonalInfo(token), this.getInitialCards(token)]);
    }

    //получение информации о пользователе с сервера
    getPersonalInfo(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
        })
            .then(this._getResponseData);
    }

    //получение карточек пользователей с сервера
    getInitialCards(token) {
        return fetch(`${this._baseUrl}/cards`, {
            headers: {...this._headers, Authorization: `Bearer ${token}`},
        })
            .then(this._getResponseData);
    }

    //отправка информации о пользователе на сервер
    showUserInfo(data, token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then(this._getResponseData);
    }

    //добавление карточки
    addNewCard(data, token) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
            body: JSON.stringify({
                link: data.link,
                name: data.name

            })
        })
            .then(this._getResponseData);
    }

    //добавление лайка
    likeCard(cardId, token) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
        })
            .then(this._getResponseData)
    }

    //удаление лайка
    unlikeCard(cardId, token) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
        })
            .then(this._getResponseData)
    }

    //отображение кол-ва лайков у карточки
    showLikesNumber(cardId, isLiked, token) {
        if (isLiked) {
            return this.likeCard(cardId, token);
        } else {
            return this.unlikeCard(cardId, token);
        }
    }

    //удаление своей карточки
    deleteCard(cardId, token) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
        })
            .then(this._getResponseData);
    }

    // изменение аватара
    editAvatar(data, token) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {...this._headers, Authorization: `Bearer ${token}`},
            body: JSON.stringify({
                avatar: data.avatar
            })
        })
            .then(this._getResponseData);
    }
}

export const api = new Api({
    baseUrl: 'https://api.alina.mesto.nomoredomains.monster',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})