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
  const [isInfoTooltipSuccessful, setIsInfoTooltipSuccessful] = React.useState(true);
  //переменные состояния, отвечающие за видимость попапа с картинкой
  const [selectedCard, setSelectedCard] = React.useState(false);
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

  //передаем массив с данными пользователя и имеющимися карточками методу Promise.all
  React.useEffect(() => {
    Promise.all([api.getPersonalInfo(), api.getInitialCards()])
      .then(([data, card]) => {
        setCurrentUser(data);
        setCards(card);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    //проверяем валидность токена пользователя
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      auth.getPersonalData(token)
        .then((res) => {
          if (res) {
            // авторизуем пользователя+получаем имейл пользователя
            setUserData({ email: res.data.email });
            setLoggedIn(true);
            history.push("/");
          }
        })
        //ловим ошибку и сообщаем пользователю в модальном окне
        .catch((err) => {
          console.log(err);
          setIsInfoTooltipSuccessful(false);
          setIsInfoTooltipOpen(true);
        });
    }
  }, [history]);

  //функция регистрации пользователя
  function handleRegister(email, password) {
    auth.register(email, password).then((res) => {
      localStorage.setItem("token", res.token);
      setUserData(res.data);
      setIsInfoTooltipSuccessful(true);
      history.push("/sign-in");
    })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipSuccessful(false);
      })
      .finally(() => setIsInfoTooltipOpen(true));
  }

  //функция авторизации пользователя
  function handleLogin(email, password) {
    auth.authorize(email, password).then((res) => {
      if (res.token) {
        localStorage.setItem("token", res.token);
        setUserData({ email: email });
        setLoggedIn(true);
        history.push("/");
      }
    })
      .catch((err) => {
        console.log(err);
        setIsInfoTooltipSuccessful(false);
        setIsInfoTooltipOpen(true);
      });
  }

  //функция выхода пользователя из аккаунта
  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
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
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем добавление кол-ва лайков
    api.showLikesNumber(card._id, !isLiked).then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((cards) => cards.filter((c) => c._id !== card._id));
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция обновления данных пользователя
  function handleUpdateUser(data) {
    api.showUserInfo(data).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция изменения аватара
  function handleUpdateAvatar(data) {
    api.editAvatar(data).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  //функция добаления карточки
  function handleAddPlaceSubmit(data) {
    api.addNewCard(data).then((newCard) => {
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

          <Header handleLogout={handleLogout} userData={userData} />

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
              <Login onLogin={handleLogin}></Login>
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