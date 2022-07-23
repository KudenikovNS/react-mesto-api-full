import { useState, useEffect } from "react";

export default function AuthForm({ name, buttonText, onSubmit, children }) {
	const [values, setValues] = useState({
		email: {
			message: '',
			value: '',
			isValid: false,
		},
		password: {
			message: '',
			value: '',
			isValid: false,
		},
	});

	const [isFormValid, setFormValid] = useState(false);
	const handleChange = (event) => {
		const { name, value, validationMessage, validity } = event.target;
		setValues((values) => ({
			...values,
			[name]: {
				message: validationMessage,
				value,
				isValid: validity.valid,
			},
		}));
	}

	useEffect(() => {
		setFormValid(values.email.isValid && values.password.isValid);
	}, [values]);

	function handleSubmit(evt) {
		evt.preventDefault();
		const data = {
			password: values.password.value,
			email: values.email.value,
		};
		onSubmit(data);
	}

	return (
		<div className="authorization-page">
			<form className="form">
				<h2 className="authorization-page__title	">{name}</h2>
				<label className="form__sticker">
					<input
						className="form__input form__input_dark"
						name="email"
						type="email"
						id="email"						
						value={values.email.value}
						onChange={handleChange}
						minLength={4}
						required
						placeholder="Email"
					/>
					<span className={`form__input-error ${values.email.isValid ? '' : 'form__input-error_active'}`}>{values.email.message}</span>
				</label>
				<label className="form__sticker">
					<input
						className="form__input form__input_dark"
						name="password"
						type="password"
						id="password"
						value={values.password.value}
						onChange={handleChange}
						minLength={4}
						required
						placeholder="Пароль"
					/>
					<span className={`form__input-error ${values.password.isValid ? '' : 'form__input-error_active'}`}>{values.password.message}</span>
				</label>
			</form>
				<button
					className={`btn authorization-page__btn-submit	 ${isFormValid ? '' : 'authorization-page__btn-submit_disabled'}`}
					type="submit"
					onClick={handleSubmit}
					disabled={!isFormValid}
				>
					{buttonText}
				</button>
				{children}
		</div>
	);
}
