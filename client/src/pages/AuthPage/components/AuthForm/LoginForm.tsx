import { useState } from "react";
import InputField from "../../../../components/InputField/InputField";
import type { LoginData } from "../../../../types";
import { validateLogin, type LoginErrors } from "./validation";
import { loginRequest } from "../../../../api/authApi";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
// import { useNavigate } from "react-router-dom";

interface LoginFormProps {
	styles: CSSModuleClasses;
	onSwitch: () => void;
}

const LoginForm = ({ styles, onSwitch }: LoginFormProps) => {
	const [loginData, setLoginData] = useState<LoginData>({ nickname: "", password: "" });
	const [errors, setErrors] = useState<LoginErrors>({});
	const [serverError, setServerError] = useState("");

	// const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setLoginData({ ...loginData, [name]: value });

		if (errors[name as keyof LoginErrors]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleSubmit = async () => {
		const validatedErrors = validateLogin(loginData.nickname, loginData.password);

		if (Object.keys(validatedErrors).length > 0) {
			setServerError("");
			setErrors(validatedErrors);
			return;
		}

		try {
			const data = await loginRequest(loginData);
			console.log(data);
			// navigate("/");
		} catch (error: any) {
			const message = error.response?.data?.message || "Ошибка сервера";
			setServerError(message);
		}
	};

	return (
		<>
			<div className={styles.form__main}>
				<InputField
					name="nickname"
					onChange={handleChange}
					type="text"
					value={loginData.nickname}
					label="Логин"
					placeholder={"Введите ваш логин"}
					error={errors.nickname}
				/>
				<InputField
					name="password"
					onChange={handleChange}
					type="password"
					value={loginData.password}
					label="Пароль"
					placeholder={"Введите ваш пароль"}
					error={errors.password}
				/>
			</div>
			{serverError && <ErrorMessage msg={serverError} result="error" />}

			<button className={`${styles.form__button} btn`} onClick={handleSubmit}>
				Войти
			</button>
			<p className={styles.form__link}>
				Нет аккаунта? <span onClick={onSwitch}>Создать</span>
			</p>
		</>
	);
};
export default LoginForm;
