import type { RegisterData } from "../../../../types";

export interface LoginErrors {
	nickname?: string;
	password?: string;
}

export interface RegisterErrors {
	firstName?: string;
	lastName?: string;
	nickname?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	role?: string;
}

export const validateLogin = (nickname: string, password: string): LoginErrors => {
	const errors: LoginErrors = {};

	if (!nickname.trim()) {
		errors.nickname = "Введите логин";
	}

	if (!password) {
		errors.password = "Введите пароль";
	}

	return errors;
};

export const validateRegister = (formData: RegisterData): RegisterErrors => {
	const errors: RegisterErrors = {};

	if (!formData.firstName.trim()) {
		errors.firstName = "Введите имя";
	}

	if (!formData.lastName.trim()) {
		errors.lastName = "Введите фамилию";
	}

	if (!formData.nickname.trim()) {
		errors.nickname = "Введите логин";
	} else if (formData.nickname.length < 3) {
		errors.nickname = "Логин минимум 3 символа";
	}

	if (!formData.email.trim()) {
		errors.email = "Введите email";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
		errors.email = "Некорректный email";
	}

	if (!formData.password) {
		errors.password = "Введите пароль";
	} else if (formData.password.length < 8) {
		errors.password = "Минимум 8 символов";
	} else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
		errors.password = "Пароль должен содержать буквы и цифры";
	}

	if (!formData.confirmPassword) {
		errors.confirmPassword = "Подтвердите пароль";
	} else if (formData.password !== formData.confirmPassword) {
		errors.confirmPassword = "Пароли не совпадают";
	}

	if (!formData.role) {
		errors.role = "Выберите роль";
	}

	return errors;
};
