import { useState } from "react";
import styles from "./AuthForm.module.scss";
import InputField from "../../../../components/InputField/InputField";
import SelectField from "../../../../components/SelectField/SelectField";
import type { RegisterData, UserRole } from "../../../../types";
import { validateRegister, type RegisterErrors } from "./validation";
import { registerRequest } from "../../../../api/authApi";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface RegisterFormProps {
	styles: CSSModuleClasses;
	onSwitch: () => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterForm = ({ styles, onSwitch, setLoading }: RegisterFormProps) => {
	const [registerData, setRegisterData] = useState<RegisterData>({
		firstName: "",
		lastName: "",
		nickname: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "",
	});

	const [errors, setErrors] = useState<RegisterErrors>({});
	const [serverMessage, setServerMessage] = useState("");
	const [result, setResult] = useState<"error" | "success">("error");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setRegisterData({ ...registerData, [name]: value });

		if (errors[name as keyof RegisterErrors]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleChangeSelect = (role: UserRole) => {
		setRegisterData({ ...registerData, role });

		if (errors.role) setErrors({ ...errors, role: undefined });
	};

	const handleSubmit = async () => {
		const validatedErrors = validateRegister(registerData);

		if (Object.keys(validatedErrors).length > 0) {
			setErrors(validatedErrors);
			return;
		}

		setLoading(true);

		try {
			const data = await registerRequest(registerData);

			setServerMessage("Регистрация прошла успешно");
			setResult("success");

			setRegisterData({
				firstName: "",
				lastName: "",
				nickname: "",
				email: "",
				password: "",
				confirmPassword: "",
				role: "",
			});
			setLoading(false);
		} catch (error: any) {
			const message = error.response?.data?.message || "Ошибка сервера";
			setServerMessage(message);
			setResult("error");
			setLoading(false);
		}
	};

	return (
		<>
			<div className={styles.form__main}>
				<div className={styles.form__row}>
					<InputField
						name="firstName"
						onChange={handleChange}
						type="text"
						value={registerData.firstName}
						label="Имя"
						placeholder="Введите ваше имя"
						error={errors.firstName}
					/>
					<InputField
						name="lastName"
						onChange={handleChange}
						type="text"
						value={registerData.lastName}
						label="Фамилия"
						placeholder="Введите вашу фамилию"
						error={errors.lastName}
					/>
				</div>

				<div className={styles.form__row}>
					<InputField
						name="nickname"
						onChange={handleChange}
						type="text"
						value={registerData.nickname}
						label="Логин"
						placeholder="Введите ваш логин"
						error={errors.nickname}
					/>
					<InputField
						name="email"
						onChange={handleChange}
						type="email"
						value={registerData.email}
						label="Email"
						placeholder="Введите ваш email"
						error={errors.email}
					/>
				</div>

				<InputField
					name="password"
					onChange={handleChange}
					type="password"
					value={registerData.password}
					label="Пароль"
					placeholder="Придумайте пароль"
					error={errors.password}
				/>
				<InputField
					name="confirmPassword"
					onChange={handleChange}
					type="password"
					value={registerData.confirmPassword}
					label="Подтвердить пароль"
					placeholder="Подтвердите пароль"
					error={errors.confirmPassword}
				/>
				<SelectField
					value={registerData.role}
					error={errors.role}
					onChange={handleChangeSelect}
				/>
			</div>

			{serverMessage && <ErrorMessage msg={serverMessage} result={result} />}

			<button className={`${styles.form__button} btn`} onClick={handleSubmit}>
				Зарегистрировать
			</button>

			<p className={styles.form__link}>
				Есть аккаунт? <span onClick={onSwitch}>Войти</span>
			</p>
		</>
	);
};

export default RegisterForm;
