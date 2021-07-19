// export const BASE_URL = 'https://api.alina.mesto.nomoredomains.monster';

// //получаем ответ с сервера
// const getResponse = (res) => {
//     //в случае ошибки
//     if (!res.ok) {
//         return Promise.reject(`Ошибка: ${res.status}`);
//     } else {
//         //если все корректно
//         return res.json();
//     }
// }
// //регистрируем пользователя
// export const register = (email, password) => {
//     return fetch(`${BASE_URL}/signup`, {
//         mode: 'cors',
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//     })
//         .then(getResponse)
// };

// //авторизуем пользователя
// export const authorize = (email, password) => {
//     return fetch(`${BASE_URL}/signin`, {
//         mode: 'cors',
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//     })
//         .then(getResponse)
// };

// // отправляем запрос и получаем информацию о пользователе в шапку
// export const getPersonalData = (token) => {
//     return fetch(`${BASE_URL}/users/me`, {
//         mode: 'cors',
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(getResponse)
// };


export const BASE_URL = "https://api.alina.mesto.nomoredomains.monster";

export const register = (email, password) => {

	return fetch(`${BASE_URL}/signup`, {
        mode: 'no-cors',
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ password: password, email: email }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
		})
		.catch((err) => Promise.reject(err));
};

export const authorize = (email, password) => {

	return fetch(`${BASE_URL}/signin`, {
        mode: 'no-cors',
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ password: password, email: email }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
		})
		.then((data) => {
			if (data.token) {
				localStorage.setItem("jwt", data.token);
				return data;
			} else {
				return;
			}
		})
		.catch((err) => Promise.reject(err));
};

export const getPersonalData = (token) => {
	return fetch(`${BASE_URL}/users/me`, {
        mode: 'no-cors',
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status} - ${res.statusText}`);
		})
		.catch((err) => Promise.reject(err));
};