import { useState } from "react";
import styles from "./AuthForm.module.scss";
import InputField from "../../../../components/InputField/InputField";

const AuthForm = () => {
	const [mode, setMode] = useState<"register" | "login">("login");

	const toggleMode = () => {
		setMode((prev) => (prev === "login" ? "register" : "login"));
	};

	return (
		<div className={styles.form}>
			<h1 className={styles.form__title}>{mode === "login" ? "Вход" : "Регистрация"}</h1>

			<div className={styles.form__main}>
				{mode === "login" ? (
					<>
						<InputField placeholder={"Введите логин"} />
					</>
				) : (
					<div></div>
				)}
			</div>

			<button className={`${styles.form__switcher} btn`} onClick={toggleMode}>
				{mode === "login" ? "Нет аккаунта? Зарегистрируйтесь" : "Есть аккаунт? Войдите"}
			</button>
		</div>
	);
};
export default AuthForm;
