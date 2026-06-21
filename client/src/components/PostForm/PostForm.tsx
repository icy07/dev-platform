import styles from "./PostForm.module.scss";

import { useState } from "react";
import type { Post, PostType, UserRole } from "../../types";
import InputField from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import ReactMarkdown from "react-markdown";
import { createPostRequest, updatePostRequest, uploadImageRequest } from "../../api/postsApi";
import { getImageUrl } from "../../utils/getImgUrl";
import ErrorMessage from "../../pages/AuthPage/components/ErrorMessage/ErrorMessage";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addPost, updatePost } from "../../store/slices/postsSlice";

interface PostFormProps {
	initialData: Post | null;
	onSuccess?: () => void;
}

export interface FormErrors {
	title?: string;
	content?: string;
	previewImage?: string;
	type?: string;
	direction?: string;
}

const ROLES: UserRole[] = [
	"Frontend Developer",
	"Backend Developer",
	"QA Engineer",
	"Designer",
	"Manager",
	"HR",
];

export interface PostFormData {
	title: string;
	content: string;
	previewImage: string;
	type: PostType | "";
	direction: UserRole | "";
}

const POST_TYPES: PostType[] = ["Контент", "Событие", "Вакансия"];

const PostForm = ({ initialData, onSuccess }: PostFormProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const [postData, setPostData] = useState<PostFormData>(
		initialData
			? {
					title: initialData.title,
					content: initialData.content,
					previewImage: initialData.previewImage ?? "",
					type: initialData.type,
					direction: initialData.direction,
				}
			: {
					title: "",
					content: "",
					previewImage: "",
					type: "",
					direction: "",
				},
	);
	const [errors, setErrors] = useState<FormErrors>({});
	const [serverMessage, setServerMessage] = useState("");
	const [isPreview, setIsPreview] = useState(false);
	const [isNewPreview, setIsNewPreview] = useState(false);

	const [imgFile, setImgFile] = useState<File | null>(null);
	const [previewImg, setPreviewImg] = useState<string>(initialData?.previewImage ?? "");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setPostData({ ...postData, [name]: value });

		if (errors[name as keyof FormErrors]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleChangeSelect = (field: "type" | "direction") => (value: PostType | UserRole) => {
		setPostData({ ...postData, [field]: value });

		if (errors[field]) {
			setErrors({ ...errors, [field]: undefined });
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImgFile(file);
		setIsNewPreview(true);

		const previewUrl = URL.createObjectURL(file);
		setPreviewImg(previewUrl);
	};

	const validateForm = (formData: Post): FormErrors => {
		const errors: FormErrors = {};

		if (!formData.title.trim()) {
			errors.title = "Заполните название";
		} else if (formData.title.length > 100) {
			errors.title = "Название должно быть не более 100 символов";
		}

		if (!formData.content.trim()) {
			errors.content = "Заполните контент";
		} else if (formData.content.length > 20000) {
			errors.content = "Контент должен быть не более 20000 символов";
		}

		if (!formData.type) {
			errors.type = "Выберите тип поста";
		}

		if (!formData.direction) {
			errors.direction = "Выберите направление";
		}

		return errors;
	};

	const handleSubmit = async () => {
		const validatedErrors = validateForm(postData as Post);

		if (Object.keys(validatedErrors).length > 0) {
			setErrors(validatedErrors);
			return;
		}

		try {
			let previewImageUrl = postData.previewImage;

			if (isNewPreview) {
				const formData = new FormData();
				formData.append("image", imgFile!);

				const { data } = await uploadImageRequest(formData);
				previewImageUrl = data.url;
			}

			if (initialData) {
				const { data } = await updatePostRequest(initialData._id, {
					...postData,
					previewImage: previewImageUrl,
				});
				dispatch(updatePost(data));
			} else {
				const { data } = await createPostRequest({
					...postData,
					previewImage: previewImageUrl,
				});
				dispatch(addPost(data));
			}

			onSuccess?.();
		} catch (err: any) {
			const message = err.response?.data?.message || "Ошибка сервера";
			setServerMessage(message);
		}
	};

	return (
		<div className={styles.form}>
			<InputField
				name="title"
				onChange={handleChange}
				type="text"
				value={postData.title}
				label="Заголовок"
				placeholder={"Напишите заголовок статьи"}
				error={errors.title}
			/>

			<div className={styles.editor}>
				<div className={styles.editor__tabs}>
					<button
						type="button"
						className={`${styles.editor__tab} ${!isPreview ? styles.editor__tab_active : ""}`}
						onClick={() => setIsPreview(false)}
					>
						Редактор
					</button>
					<button
						type="button"
						className={`${styles.editor__tab} ${isPreview ? styles.editor__tab_active : ""}`}
						onClick={() => setIsPreview(true)}
					>
						Превью
					</button>
				</div>

				{isPreview ? (
					<div className={styles.editor__preview}>
						{postData.content ? (
							<ReactMarkdown>{postData.content}</ReactMarkdown>
						) : (
							<p className={styles.editor__empty}>Нет контента для отображения</p>
						)}
					</div>
				) : (
					<InputField
						name="content"
						onChange={handleChange}
						type="text"
						value={postData.content}
						label="Текст статьи"
						placeholder="Напишите текст в формате Markdown"
						error={errors.content}
						isTextArea={true}
					/>
				)}

				<span
					className={`${styles.editor__counter} ${postData.content.length > 20000 ? styles.editor__counter_error : ""}`}
				>
					{postData.content.length} / 20000
				</span>
			</div>

			<SelectField
				label="Тип поста"
				value={postData.type}
				onChange={handleChangeSelect("type")}
				options={POST_TYPES}
				error={errors.type}
			/>

			<SelectField
				label="Направление"
				value={postData.direction}
				onChange={handleChangeSelect("direction")}
				options={ROLES}
				error={errors.direction}
			/>

			<div className={styles.imageUpload}>
				{previewImg ? (
					<div className={styles.imageUpload__preview}>
						<img
							src={
								initialData && initialData.previewImage && !isNewPreview
									? getImageUrl(initialData.previewImage)
									: previewImg
							}
							alt="превью"
						/>
						<button
							type="button"
							className={styles.imageUpload__remove}
							onClick={() => {
								setImgFile(null);
								setPreviewImg("");
								setIsNewPreview(false);
							}}
						>
							Удалить
						</button>
					</div>
				) : (
					<label className={styles.imageUpload__label}>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className={styles.imageUpload__input}
						/>
						<span>Выбрать изображение</span>
					</label>
				)}
			</div>

			{serverMessage && <ErrorMessage msg={serverMessage} result={"error"} />}

			<button className={`${styles.form__button} btn`} onClick={handleSubmit}>
				{initialData ? "Сохранить изменения" : "Опубликовать"}
			</button>
		</div>
	);
};
export default PostForm;
