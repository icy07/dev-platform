import { useState } from "react";
import styles from "./AuthForm.module.scss";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthForm = () => {
	const [mode, setMode] = useState<"register" | "login">("login");

	return (
		<div className={styles.form}>
			<h1 className={styles.form__title}>{mode === "login" ? "Вход" : "Регистрация"}</h1>
			{mode === "login" ? (
				<LoginForm styles={styles} onSwitch={() => setMode("register")} />
			) : (
				<RegisterForm styles={styles} onSwitch={() => setMode("login")} />
			)}
		</div>
	);
};
export default AuthForm;
