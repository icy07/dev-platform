import { useState } from "react";
import styles from "./AuthForm.module.scss";
import InputField from "../../../../components/InputField/InputField";

interface RegisterFormProps {
	styles: CSSModuleClasses;
	onSwitch: () => void;
}

const RegisterForm = ({ styles, onSwitch }: RegisterFormProps) => {
	return (
		<>
			<div className={styles.form__main}>
				<InputField title="Логин" placeholder={"Введите ваш логин"} />
			</div>
			<button className={`${styles.form__button} btn`}>Зарегистрировать</button>
			<p className={styles.form__link}>
				Есть аккаунт? <span onClick={onSwitch}>Войти</span>
			</p>
		</>
	);
};
export default RegisterForm;
