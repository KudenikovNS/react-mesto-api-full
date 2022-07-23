import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, loading }) {
	const currentUser = useContext(CurrentUserContext);
	const [isFormValid, setFormValid] = useState(false);
	const [values, setValues] = useState({
		name: {
			message: '',
			value: '',
			isValid: false,
		},
		about: {
			message: '',
			value: '',
			isValid: false,
		},
	});

	useEffect(() => {
		setValues(values => ({
			...values,
			name: {
				value: currentUser.name,
				isValid: true,
			},
			about: {
				value: currentUser.about,
				isValid: true,
			},
		}));
	}, [currentUser, isOpen]);

	useEffect(() => {
		setFormValid(values.name.isValid && values.about.isValid);
	}, [values]);

	const handleChange = (event) => {
		const { name, value, validationMessage, validity } = event.target;
		setValues((values) => ({
			...values,
			[name]: {
				value,
				message: validationMessage,
				isValid: validity.valid,
			},
		}));
	};


	function handleSubmit(evt) {
		evt.preventDefault();
		const data = {
			name: values.name.value,
			about: values.about.value,
		};
		onUpdateUser(data);
	}

	return (
		<PopupWithForm
			name='profile'
			title='Редактировать профиль'
			buttonText={loading ? 'Сохранение...' : 'Сохранить'}
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			isFormValid={isFormValid}
			>
			<label className="form__sticker">
				<input
					className="form__input"
					name="name"
					type="text"
					id="name-input"
					value={values.name.value || ''}
					onChange={handleChange}
					minLength="2"
					maxLength="40"
					required
				placeholder="Имя"/>
				<span className={`form__input-error ${values.name.isValid ? '' : 'form__input-error_active'}`}>{values.name.message}</span>
			</label>
			<label className="form__sticker">
				<input
					className="form__input"
					name="about"
					type="text"
					id="about-input"
					value={values.about.value || ''}
					onChange={handleChange}
					minLength="2"
					maxLength="200"
					required
					placeholder="О себе"/>
				<span className={`form__input-error ${values.about.isValid ? '' : 'form__input-error_active'}`}>{values.about.message}</span>
			</label>
		</PopupWithForm>
	);
};

export default EditProfilePopup;
