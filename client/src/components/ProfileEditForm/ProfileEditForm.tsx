import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useState } from "react";
import InputField from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import type { UserProfile, UserRole } from "../../types";
import ErrorMessage from "../../pages/AuthPage/components/ErrorMessage/ErrorMessage";
import { updateUserRequest } from "../../api/usersApi";
import { updateProfile } from "../../store/slices/profileSlice";

interface ProfileErrors {
	firstName?: string;
	lastName?: string;
	nickname?: string;
	role?: string;
}

const ROLES: UserRole[] = [
	"Frontend Developer",
	"Backend Developer",
	"QA Engineer",
	"Designer",
	"Manager",
	"HR",
];

type ProfileEditFormData = Omit<UserProfile, "_id" | "portfolio" | "role"> & {
	role: UserRole | "";
	description: string;
	workplace: string;
};

type ProfileEditFormProps = {
	onSuccess?: () => void;
};

const ProfileEditForm = ({ onSuccess }: ProfileEditFormProps) => {
	const profile = useSelector((state: RootState) => state.profile.profile);
	const dispatch = useDispatch<AppDispatch>();

	const [formData, setFormData] = useState<ProfileEditFormData>({
		firstName: profile?.firstName ?? "",
		lastName: profile?.lastName ?? "",
		nickname: profile?.nickname ?? "",
		role: profile?.role ?? "",
		description: profile?.description ?? "",
		workplace: profile?.workplace ?? "",
	});
	const [errors, setErrors] = useState<ProfileErrors>({});
	const [serverMessage, setServerMessage] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setFormData({ ...formData, [name]: value });

		if (errors[name as keyof ProfileErrors]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleChangeSelect = (role: UserRole) => {
		setFormData({ ...formData, role });

		if (errors.role) setErrors({ ...errors, role: undefined });
	};

	const validateForm = (formData: ProfileEditFormData): ProfileErrors => {
		const errors: ProfileErrors = {};

		if (!formData.firstName.trim()) {
			errors.firstName = "Укажите ваше имя";
		}

		if (!formData.lastName.trim()) {
			errors.lastName = "Укажите вашу фамилия";
		}

		if (!formData.nickname) {
			errors.nickname = "Укажите ваш никнейм";
		}

		if (!formData.role) {
			errors.role = "Выберите вашу роль";
		}
		return errors;
	};

	const handleSubmit = async () => {
		const validatedErrors = validateForm(formData);

		if (Object.keys(validatedErrors).length > 0) {
			setErrors(validatedErrors);
			return;
		}

		const payload: Partial<UserProfile> = {
			...formData,
			role: formData.role as UserRole,
		};

		try {
			const { data } = await updateUserRequest(profile!._id, payload);
			dispatch(updateProfile(data.user));

			onSuccess?.();
		} catch (err: any) {
			const message = err.response?.data?.message || "Ошибка сервера";
			setServerMessage(message);
		}
	};

	return (
		<div className="form">
			<InputField
				name="firstName"
				onChange={handleChange}
				type="text"
				value={formData.firstName}
				label="Имя"
				placeholder={"Ваше имя"}
				error={errors.firstName}
			/>
			<InputField
				name="lastName"
				onChange={handleChange}
				type="text"
				value={formData.lastName}
				label="Фамилия"
				placeholder={"Ваша фамилия"}
				error={errors.lastName}
			/>
			<InputField
				name="nickname"
				onChange={handleChange}
				type="text"
				value={formData.nickname}
				label="Никнейм"
				placeholder={"Ваш никнейм"}
				error={errors.nickname}
			/>
			<SelectField
				label="Роль"
				value={formData.role}
				onChange={handleChangeSelect}
				options={ROLES}
				error={errors.role}
			/>

			<InputField
				name="description"
				onChange={handleChange}
				type="text"
				value={formData.description}
				label="Описание"
				placeholder="Напишите описание профиля"
				error={undefined}
				isTextArea={true}
				isRequired={false}
			/>

			<InputField
				name="workplace"
				onChange={handleChange}
				type="text"
				value={formData.workplace}
				label="Место работы"
				placeholder={"Ваше место работы"}
				error={undefined}
				isRequired={false}
			/>

			{serverMessage && <ErrorMessage msg={serverMessage} result={"error"} />}

			<button className="form__button btn" onClick={handleSubmit}>
				Сохранить изменения
			</button>
		</div>
	);
};
export default ProfileEditForm;
