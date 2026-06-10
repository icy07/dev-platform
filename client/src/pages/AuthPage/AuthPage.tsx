import styles from "./AuthPage.module.scss";
import AuthForm from "./components/AuthForm/AuthForm";

const AuthPage = () => {
	return (
		<div className={styles.container}>
			<AuthForm />
		</div>
	);
};
export default AuthPage;
