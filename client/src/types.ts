export type UserRole =
	| "Frontend Developer"
	| "Backend Developer"
	| "QA Engineer"
	| "Designer"
	| "Manager"
	| "HR";

export interface IUser {
	id: string;
	nickname: string;
	role: UserRole;
	token: string;
}

export interface RegisterData {
	firstName: string;
	lastname: string;
	nickname: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: UserRole;
}

export interface LoginData {
	nickname: string;
	password: string;
}
