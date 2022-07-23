import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

export default function Register({ register }) {
	return (
		<AuthForm
			name="Регистрация"
			buttonText="Зарегистрироваться"
			onSubmit={register}
		>
			<span className="authorization-page__subtitle">
				Уже зарегистрированы?
				<Link to="/sign-in" className="authorization-page__link">
					Войти
				</Link>
			</span>
		</AuthForm>
	);
}
