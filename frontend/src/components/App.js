import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../context/CurrentUserContext.js';

import { api } from '../utils/Api.js';
import * as auth from '../utils/auth.js';

import Header from './Header.js';
import Register from './Register.js';
import Login from './Login.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ProtectedRoute from './ProtectedRoute.js';

import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ImagePopup from './ImagePopup.js';
import ConfirmPopup from './ConfirmPopup.js';
import InfoTooltip from './InfoTooltip.js';

function App() {
	const [isRegistrationOpenPopup, setIsRegistrationOpenPopup] = useState(false);
	const [isEditProfileOpenPopup, setIsEditProfileOpenPopup] = useState(false);
	const [isAddPlaceOpenPopup, setIsAddPlaceOpenPopup] = useState(false);
	const [isEditAvatarOpenPopup, setIsEditAvatarOpenPopup] = useState(false);
	const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);

	const [selectedCard, setSelectedCard] = useState(null);
	const [cards, setCards] = useState([]);
	const [cardDelete, setCardDelete] = useState({});
	const [loading, setLoading] = useState(false);

	const [currentUser, setCurrentUser] = useState({});
	const [userEmail, setUserEmail] = useState('');
	const [loggedIn, setLoggedIn] = useState(false);
	const [goodRegistration, setGoodRegistration] = useState(false);

	const navigation = useNavigate();
	
	function handleEditClickAvatar() {
		setIsEditAvatarOpenPopup(true);
	}

	function handleEditClickProfile() {
		setIsEditProfileOpenPopup(true);
	}

	function handleAddClickPlace() {
		setIsAddPlaceOpenPopup(true);
	}

	function handleClickCard(card) {
		setSelectedCard(card);
	}

	function handleDeleteConfirm(card) {
		setIsConfirmPopupOpen(true);
		setCardDelete(card);
	}

	function handleLikeCard(card) {
		const isLiked = card.likes.some(like => like === currentUser._id);
		api.changeLikeCard(card._id, !isLiked)
		.then((newCard) => {
			setCards((state) => state.map(c => c._id === card._id ? newCard : c));
		})
		.catch((err) => console.log(err));
	}

	function handleDeleteCard() {
		api.deleteCard(cardDelete._id)
		.then(() => {
			setCards((state) => state.filter((c) => c._id !== cardDelete._id));
			closeAllPopups();
		})
		.catch((err) => console.log(err));
	}

	function handleUserUpdate(user) {
		setLoading(true);
		api.setProfile(user)
			.then(user => {
				setCurrentUser(user);
				closeAllPopups();
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	function handleAvatarUpdate({avatar}) {
		setLoading(true);
		api.editAvatar(avatar)
			.then(user => {
				setCurrentUser(user);
				closeAllPopups();
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	function handleAddPlace(card) {
		setLoading(true);
		api.addNewCard(card)
			.then(newCard => {
				setCards([newCard, ...cards]);
				closeAllPopups();
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}

	function handleEscClose(evt) {
		if (evt.key === 'Escape') {
			evt.preventDefault();
			closeAllPopups();
		}
	}

	function closeAllPopups() {
		setIsEditProfileOpenPopup(false);
		setIsAddPlaceOpenPopup(false);
		setIsEditAvatarOpenPopup(false);
		setIsConfirmPopupOpen(false);
		setSelectedCard(null);
		setIsRegistrationOpenPopup(false);
	}

	function registerOn(data) {
		auth.register(data)
			.then((res) => {
				if (res) {
					setGoodRegistration(true);
					setIsRegistrationOpenPopup(true);
					navigation('/sign-in');
				} else {
					setGoodRegistration(false);
					setIsRegistrationOpenPopup(true);
				}
			})
			.catch((err) => {
				setIsRegistrationOpenPopup(true);
				console.log(err);
				setGoodRegistration(false);
			})
			.finally(() => { });
	}

	function loginOn(data) {
		auth.login(data)
			.then((data) => {
				if (data) {
					localStorage.setItem("jwt", data.token);
					setUserEmail(data.email);
					setLoggedIn(true);
					navigation('/');
				} else {
					setIsRegistrationOpenPopup(true);
				}
			})
			.catch((err) => {
				setIsRegistrationOpenPopup(true);
				console.log(err);
			})
			.finally(() => { });

	}

	function onSignOut() {
		localStorage.removeItem("jwt");
		setLoggedIn(false);
		setUserEmail('');
		navigation('/sign-in');
	}

	function handleTokenCheck() {
		const jwt = localStorage.getItem('jwt');
		if (jwt) {
			auth.checkToken(jwt)
				.then((res) => {
					setLoggedIn(true);
					navigation('/');
					setUserEmail(res.email);
				})
				.catch((err) => console.log(err));
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleEscClose);
		return () => document.removeEventListener('keydown', handleEscClose);
	}, []);

	useEffect(() => {
		handleTokenCheck();
		if (loggedIn) {
			Promise.all([api.getProfileInfo(), api.getInitialCards()])
				.then(([userData, cardData]) => {
					setCurrentUser(userData);
					setCards(cardData);
					cardData.reverse();
				})
				.catch((err) => console.log(err))
				.finally(() => { });
		}
	}, [loggedIn]);

	return (
		<CurrentUserContext.Provider value={currentUser}>
			<div className="page__container">
				<Header email={userEmail} loggedIn={loggedIn} exit={onSignOut} />
				<Routes>
					<Route
						exact path='/'
						element= {
							<ProtectedRoute loggedIn={loggedIn}>
								<Main 
									cards={cards}
									onEditProfile={handleEditClickProfile}
									onAddPlace={handleAddClickPlace}
									onEditAvatar={handleEditClickAvatar}
									onCardClick={handleClickCard}
									onCardLike={handleLikeCard}
									onCardDelete={handleDeleteConfirm}
								/>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/sign-up"
						element={
							<Register
								register={registerOn}
								isPopupOpen={isRegistrationOpenPopup}
								openPopup={setIsRegistrationOpenPopup}
								closePopup={closeAllPopups}
							/>
						}
					/>
					<Route
						path="/sign-in"
						element={
							<Login
								login={loginOn}
								isPopupOpen={isRegistrationOpenPopup}
								openPopup={setIsRegistrationOpenPopup}
								closePopup={closeAllPopups}
							/>
						}
					/>
				</Routes>
				<Footer />

				<EditProfilePopup
					isOpen={isEditProfileOpenPopup}
					onClose={closeAllPopups}
					onUpdateUser={handleUserUpdate}
					loading={loading}
				/>

				<EditAvatarPopup
					isOpen={isEditAvatarOpenPopup}
					onClose={closeAllPopups}
					onUpdateAvatar={handleAvatarUpdate}
					loading={loading}
				/>

				<AddPlacePopup
					isOpen={isAddPlaceOpenPopup}
					onClose={closeAllPopups}
					onAddPlace={handleAddPlace}
					loading={loading}
				/>

				<ConfirmPopup
					isOpen={isConfirmPopupOpen}
					onClose={closeAllPopups}
					onCardDelete={handleDeleteCard}
				/>

				<ImagePopup card={selectedCard} onClose={closeAllPopups} />

				<InfoTooltip
					isOpen={isRegistrationOpenPopup}
					onClose={closeAllPopups}
					success={goodRegistration}
				/>
			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;
