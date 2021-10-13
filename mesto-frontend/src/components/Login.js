import React from 'react';

export function Login(props) {
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

    //Обработчик формы входа в аккаунт
    function handleSubmit(e) {
        e.preventDefault();
        const { email, password } = data;
        props.onLogin(email, password);
    }

    return (
            <div className="login">
                <h2 className="login__header">Вход</h2>
                <form onSubmit={handleSubmit} className="login__form" noValidate>
                    <input onChange={handleChange} value={data.email || ''} className="login__input" id="email" type="email" name="email" placeholder="Email" required />
                    <input onChange={handleChange} value={data.password || ''} className="login__input login__input_type_password" id="password" type="password" name="password" placeholder="Пароль" required />
                    <button className="login__submit" type="submit">Войти</button>
                </form>
            </div>
    )
}