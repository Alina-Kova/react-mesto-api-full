import React from 'react';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { api } from '../utils/api.js';
import { Header } from './Header.js'
import { Main } from './Main.js'
import { Footer } from './Footer.js'
import { PopupWithForm } from './PopupWithForm.js';
import { ImagePopup } from './ImagePopup.js';
import { EditProfilePopup } from './EditProfilePopup.js';
import { EditAvatarPopup } from './EditAvatarPopup.js';
import { AddPlacePopup } from './AddPlacePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute.js';
import { InfoTooltip } from './InfoTooltip.js';
import { Login } from './Login.js';
import { Register } from './Register.js';
import * as auth from '../utils/auth.js'

function App() {
  //переменные состояния, отвечающие за видимость попапов изменения данных пользователя, доб-я карточки и изменения аватара
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  //переменные состояния, отвечающие за видимость модального окна с инфой об успешной или нет регистрации
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  //переменные состояния, определяющие успешно ли регистрируется/логинится пользователь
  const [isInfoTooltipSuccessful, setIsInfoTooltipSuccessful] = React.useState(false);
  //переменные состояния, отвечающие за видимость попапа с картинкой
  const [selectedCard, setSelectedCard] = React.useState(null);
  //переменные состояния, определяющие данные текущего пользователя
  const [currentUser, setCurrentUser] = React.useState({});
  //переменные состояния с пустым массивом карточек, подтягивает данные о карточках через API
  const [cards, setCards] = React.useState([]);
  //переменные состояния, определяющие имейл зарегистрированного пользователя
  const [userData, setUserData] = React.useState({
    email: "",
  });
  //переменные состояния, определяющие залогинился ли пользователь
  const [loggedIn, setLoggedIn] = React.useState(false);
  const history = useHistory();
  const [token, setToken] = React.useState('');

  //проверяем валидность токена пользователя
  const checkToken = React.useCallback(
    () => {
    const token = localStorage.getItem('token');

    if (token) {
      setToken(token);

    auth.getPersonalData(token)
    .then((res) => {
      if (res) {
        // авторизуем пользователя+получаем имейл пользователя
        setLoggedIn(true);
        setUserData({ email: res.email });
        history.push("/");
      }
    })
      .catch((err) => {
        console.log(err);
      });
    }
  }, 
  [history]
  );

  React.useEffect(() => {
    checkToken();
  }, [checkToken])

  React.useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('token');
      api.getData(token)
        .then((res) => {
          const [data, card] = res;
          setCurrentUser(data);
          setCards(card.reverse());
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedIn])

  //функция регистрации пользователя
  function handleRegister(email, password) {
    auth.register(email, password).then(() => {
      history.push("/sign-in");
      setIsInfoTooltipOpen(true);
      setIsInfoTooltipSuccessful(true);
    })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipOpen(true);
        setIsInfoTooltipSuccessful(false);
      });
  }

  //функция авторизации пользователя
  function handleLogin(email, password) {
    auth.authorize(email, password).then((res) => {
        setLoggedIn(true);
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUserData({ email: email });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      })  
  }

  //функция выхода пользователя из аккаунта
  function handleLogout() {  
    setLoggedIn(false);
    localStorage.removeItem('token');
    setToken('');
    setUserData({ email: "" });
    history.push("/sign-in");
  }

  //обработчик формы изменения аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  };

  //обработчик формы с информацией о пользователе
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  };

  //обработчик формы добавления карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  };

  //обработчик попапа с полноразмерной картинкой
  function handleCardClick(card) {
    setSelectedCard(card)
  };

  //обработчик закрытия всех попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsInfoTooltipOpen(false);
  };

  //функция добавления/удаления лайка
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
    // Отправляем запрос в API и получаем добавление кол-ва лайков
    api.showLikesNumber(card._id, !isLiked, token).then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id, token).then(() => {
      setCards((cards) => cards.filter((c) => c._id !== card._id));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция обновления данных пользователя
  function handleUpdateUser(data) {
    api.showUserInfo(data, token).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция изменения аватара
  function handleUpdateAvatar(data) {
    api.editAvatar(data, token).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция добаления карточки
  function handleAddPlaceSubmit(data) {
      api.addNewCard(data, token).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">

          <Header loggedIn={loggedIn} handleLogout={handleLogout} userData={userData} />

          <Switch>

            <ProtectedRoute
              exact path="/"
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              component={Main}
              loggedIn={loggedIn} />

            <Route path="/sign-in">
              <Login onLogin={handleLogin} ></Login>
            </Route>

            <Route path="/sign-up">
              <Register onRegister={handleRegister}></Register>
            </Route>

            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          <Footer />

          <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isSuccessful={isInfoTooltipSuccessful} />

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

          <PopupWithForm onClose={closeAllPopups} title="Вы уверены?" buttonText="Да" name="delete-card" />

          <ImagePopup onClose={closeAllPopups} card={selectedCard} />

        </div>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;