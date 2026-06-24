import { useEffect } from "react";
import styles from "./AuthPage.module.scss";
import AuthForm from "./components/AuthForm/AuthForm";

const AuthPage = () => {
	useEffect(() => {
		document.title = "Авторизация";
	}, []);

	return (
		<div className={styles.container}>
			<AuthForm />
		</div>
	);
};
export default AuthPage;
