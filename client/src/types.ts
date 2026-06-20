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
	lastName: string;
	nickname: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: UserRole | "";
}

export interface LoginData {
	nickname: string;
	password: string;
}

//! POST TYPES ======================================================================================================

export type PostType = "Контент" | "Событие" | "Вакансия";

export interface Post {
	_id: string;
	title: string;
	content: string;
	author: { _id: string; nickname: string; role: UserRole };
	type: PostType;
	direction: UserRole;
	likes: number;
	isLikedByUser: boolean;
	previewImage?: string;
	createdAt: string;
}
