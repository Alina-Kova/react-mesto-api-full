import React from 'react';
import { Link } from 'react-router-dom';

export function Register(props) {
    const [data, setData] = React.useState({
        email: "",
        password: "",
    });

    //Обработчик полей ввода имейла и пароля
    function handleChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }

    //Обработчик формы регистрации аккаунта
    function handleSubmit(e) {
        e.preventDefault();
        const { email, password } = data;
        props.onRegister(email, password);
    }

    return (
            <div className="register">
                <h2 className="register__header">Регистрация</h2>
                <form onSubmit={handleSubmit} className="register__form" noValidate>
                    <input onChange={handleChange} className="register__input" id="email" type="email" name="email" placeholder="Email" required />
                    <input onChange={handleChange} className="register__input register__input_type_password" id="password" type="password" name="password" placeholder="Пароль" required />
                    <button className="register__submit register__submit_type_signup" type="submit">Зарегистрироваться</button>
                </form>
                <h3 className="register__subtitle">Уже зарегистрированы?&nbsp;
                <Link to="/sign-in" className="register__login-button">Войти</Link>
                </h3>
            </div>
    )
}