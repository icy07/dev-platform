import { useState } from "react";
import styles from "./AuthForm.module.scss";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Loader from "../../../../components/Loader/Loader";

const AuthForm = () => {
	const [mode, setMode] = useState<"register" | "login">("login");
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<div className={styles.form}>
			{loading && <Loader />}

			<h1 className={styles.form__title}>{mode === "login" ? "Вход" : "Регистрация"}</h1>
			{mode === "login" ? (
				<LoginForm
					setLoading={setLoading}
					styles={styles}
					onSwitch={() => setMode("register")}
				/>
			) : (
				<RegisterForm
					setLoading={setLoading}
					styles={styles}
					onSwitch={() => setMode("login")}
				/>
			)}
		</div>
	);
};
export default AuthForm;
