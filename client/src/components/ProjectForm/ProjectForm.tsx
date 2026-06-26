import { useState } from "react";
import type { Project } from "../../types";
import InputField from "../InputField/InputField";
import ReactMarkdown from "react-markdown";
import { getImageUrl } from "../../utils/getImgUrl";
import ErrorMessage from "../../pages/AuthPage/components/ErrorMessage/ErrorMessage";
import { uploadImageRequest } from "../../api/postsApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { addProject, removeProject, updateProject } from "../../store/slices/profileSlice";
import { addProjectRequest, deleteProjectRequest, updateProjectRequest } from "../../api/usersApi";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

interface ProjectFormProps {
	initialData: Project | null;
	onSuccess: () => void;
}

interface ProjectErrors {
	title?: string;
	links?: string;
}

type ProjectFormData = Omit<Project, "_id"> & {
	description: string | "";
};

const ProjectForm = ({ initialData, onSuccess }: ProjectFormProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.profile.profile);

	const [projectForm, setProjectForm] = useState<ProjectFormData>({
		title: initialData?.title || "",
		description: initialData?.description || "",
		links: initialData?.links || [""],
		previewImage: initialData?.previewImage || "",
	});
	const [linksText, setLinksText] = useState(initialData?.links?.join("\n") ?? "");

	const [errors, setErrors] = useState<ProjectErrors>({});
	const [serverMessage, setServerMessage] = useState("");

	const [isPreview, setIsPreview] = useState(false);
	const [isNewPreview, setIsNewPreview] = useState(false);

	const [imgFile, setImgFile] = useState<File | null>(null);
	const [previewImg, setPreviewImg] = useState<string>(initialData?.previewImage ?? "");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setProjectForm({ ...projectForm, [name]: value });

		if (errors[name as keyof ProjectErrors]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			setServerMessage("Файл слишком большой. Максимальный размер — 5 МБ");
			return;
		}

		setImgFile(file);
		setIsNewPreview(true);
		setServerMessage("");

		const previewUrl = URL.createObjectURL(file);
		setPreviewImg(previewUrl);
	};

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch (error) {
			return false;
		}
	};

	const validateLinks = (text: string): string | undefined => {
		const lines = text
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);

		const inavlidLinks = lines.filter((line) => !isValidUrl(line));
		if (inavlidLinks.length > 0) {
			return `Недопустимые ссылки: ${inavlidLinks.join(", ")}`;
		}

		return undefined;
	};

	const validateForm = (formData: ProjectFormData): ProjectErrors => {
		const errors: ProjectErrors = {};

		const linkError = validateLinks(linksText);

		if (!formData.title.trim()) {
			errors.title = "Заполните название";
		} else if (formData.title.length > 100) {
			errors.title = "Название должно быть не более 100 символов";
		}

		if (linkError) {
			console.log(linkError);
			errors.links = linkError;
		}

		return errors;
	};

	const handleSubmit = async () => {
		const validatedErrors = validateForm(projectForm);

		if (Object.keys(validatedErrors).length > 0) {
			setErrors(validatedErrors);
			return;
		}

		try {
			let previewImageUrl = projectForm.previewImage;
			const links = linksText
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean);

			if (isNewPreview) {
				const formData = new FormData();
				formData.append("image", imgFile!);

				const { data } = await uploadImageRequest(formData);
				previewImageUrl = data.url;
			}

			const updatedData = { ...projectForm, links };

			if (initialData) {
				const { data } = await updateProjectRequest(profile!._id, initialData._id, {
					...updatedData,
					previewImage: previewImageUrl,
				});
				dispatch(updateProject(data.project));
			} else {
				const { data } = await addProjectRequest(profile!._id, {
					...updatedData,
					previewImage: previewImageUrl,
				});
				dispatch(addProject(data.project));
			}

			onSuccess?.();
		} catch (err: any) {
			const message = err.response?.data?.message || "Ошибка сервера";
			setServerMessage(message);
		}
	};

	return (
		<div className="form">
			<InputField
				name="title"
				onChange={handleChange}
				type="text"
				value={projectForm.title}
				label="Название"
				placeholder={"Название статьи"}
				error={errors.title}
			/>

			<div className="editor">
				<div className="editor__tabs">
					<button
						type="button"
						className={`editor__tab ${!isPreview ? "editor__tab_active" : ""}`}
						onClick={() => setIsPreview(false)}
					>
						Редактор
					</button>
					<button
						type="button"
						className={`editor__tab ${isPreview ? "editor__tab_active" : ""}`}
						onClick={() => setIsPreview(true)}
					>
						Превью
					</button>
				</div>

				{isPreview ? (
					<div className="editor__preview">
						{projectForm.description ? (
							<ReactMarkdown>{projectForm.description}</ReactMarkdown>
						) : (
							<p className="editor__empty">Нет контента для отображения</p>
						)}
					</div>
				) : (
					<InputField
						name="description"
						onChange={handleChange}
						type="text"
						value={projectForm.description}
						label="Текст портфолио"
						placeholder="Напишите текст в формате Markdown"
						error={undefined}
						isTextArea={true}
						isRequired={false}
					/>
				)}

				<span
					className={`editor__counter ${projectForm.description.length > 20000 ? "editor__counter_error" : ""}`}
				>
					{projectForm.description.length} / 20000
				</span>
			</div>

			<InputField
				name="links"
				onChange={(e) => {
					setLinksText(e.target.value);
				}}
				type="text"
				value={linksText}
				label="Ссылки"
				placeholder={"https://github.com/...\nhttps://example.com"}
				error={errors.links}
				isTextArea={true}
				isRequired={false}
			/>

			<div className="imageUpload">
				{previewImg ? (
					<div className="imageUpload__preview">
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
							className="imageUpload__remove"
							onClick={() => {
								setImgFile(null);
								setPreviewImg("");
								setIsNewPreview(false);
								setProjectForm({ ...projectForm, previewImage: "" });
							}}
						>
							Удалить
						</button>
					</div>
				) : (
					<label className="imageUpload__label">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="imageUpload__input"
						/>
						<span>Выбрать изображение</span>
					</label>
				)}
			</div>

			{serverMessage && <ErrorMessage msg={serverMessage} result={"error"} />}

			<button className="form__button btn" onClick={handleSubmit}>
				{initialData ? "Сохранить изменения" : "Опубликовать"}
			</button>
		</div>
	);
};
export default ProjectForm;
