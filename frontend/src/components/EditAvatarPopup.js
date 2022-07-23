import { useRef, useState, useEffect } from 'react';
import PopupWithForm  from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, loading }) {
	const link = useRef();
	const [values, setValues] = useState({
		message: '',
		isValid: false,
	});

	useEffect(() => {
		checkAvatarValidation(link.current);
		link.current.value = '';
		setValues((values) => ({
			...values,
			message: ''
		}))
	}, [isOpen]);

	const checkAvatarValidation = (link) => {
		setValues((values) => ({
			...values,
			message: link.validationMessage,
			isValid: link.validity.valid
		}));
	}

	function handleSubmit(evt) {
		evt.preventDefault();
		onUpdateAvatar({
			avatar: link.current.value,
		});
	}
	
	return (
		<PopupWithForm
			name='avatar'
			title='Обновить аватар'
			isFormValid={values.isValid}
			buttonText={loading ? 'Сохранение...' : 'Сохранить'}
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			>
			<label className="form__sticker">
				<input
					className="form__input"
					name="avatar"
					type="url"
					id="avatar-input"
					ref={link}
					onChange={() => checkAvatarValidation(link.current)}
					required
				  placeholder="Ссылка на картинку"/>
				<span className={`form__input-error ${values.isValid ? '' : 'form__input-error_active'}`}>{values.message}</span>
			</label>
		</PopupWithForm>
	)
};

export default EditAvatarPopup;
