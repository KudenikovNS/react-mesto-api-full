import PopupWithForm from "./PopupWithForm";
import { useState, useEffect } from "react";

function AddPlacePopup({ isOpen, onClose, onAddPlace, loading }) {
	const [isFormValid, setFormValid] = useState(false);
	const [values, setValues] = useState({
		title: {
			message: '',
			value: '',
			isValid: false,
		},
		link: {
			message: '',
			value: '',
			isValid: false,
		},
	});

	useEffect(() => {
		setValues({
			title: {
				message: '',
				value: '',
				isValid: false,
			},
			link: {
				message: '',
				value: '',
				isValid: false,
			},
		});
	}, [isOpen]);

	useEffect(() => {
		setFormValid(values.title.isValid && values.link.isValid);
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
			name: values.title.value,
			link: values.link.value,
		};
		onAddPlace(data);
	}

	return (
		<PopupWithForm
			name='card-add'
			buttonText={loading ? 'Создание...' : 'Создать'}
			title='Новое место'
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			isFormValid={isFormValid}
			
		>
			<label className="form__sticker">
				<input
					className="form__input"
					name="title"
					type="text"
					id="title-input"
					value={values.title.value || ''}
					onChange={handleChange}
					minLength="2"
					maxLength="30"
					required
					placeholder="Название"
				/>
				<span className={`form__input-error ${values.title.isValid ? '' : 'form__input-error_active'}`}>{values.title.message}</span>
			</label>
			<label className="form__sticker">
				<input
					className="form__input"
					name="link"
					type="url"
					id="link-input"
					value={values.link.value || ''}
					onChange={handleChange}
					required
				  placeholder="Ссылка на картинку"/>
				<span className={`form__input-error ${values.link.isValid ? '' : 'form__input-error_active'}`}>{values.link.message}</span>
			</label>
		</PopupWithForm>
	);
}

export default AddPlacePopup;
