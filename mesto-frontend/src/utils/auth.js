export const BASE_URL = 'https://auth.nomoreparties.co';

//получаем ответ с сервера
const getResponse = (res) => {
    //в случае ошибки
    if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
    } else {
        //если все корректно
        return res.json();
    }
}
//регистрируем пользователя
export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(getResponse)
};

//авторизуем пользователя
export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(getResponse)
};

// отправляем запрос и получаем информацию о пользователе в шапку
export const getPersonalData = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(getResponse)
};