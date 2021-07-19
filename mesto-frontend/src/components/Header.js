import logo from '../images/header-logo.svg';
import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';


export function Header(props) {
    return (
        <header className="header">
            <img src={logo} alt="логотип Место" className="header__logo" />
            <Switch>
            <Route path="/signup">
                    <Link to="/signin" className="header__button">Войти</Link>
                </Route>
                <Route path="/signin">
                    <Link to="/signup" className="header__button">Регистрация</Link>
                </Route>
                <Route exact path="/">
                    <div className="header__container">
                        <p className="header__email">{props.userData.email}</p>
                        <Link to="/signin" className="header__logout-button" onClick={props.handleLogout}>Выйти</Link>
                    </div>
                </Route>
            </Switch>
        </header>
    )
}