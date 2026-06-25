import { useState } from "react";
import type { Project } from "../../types";
import InputField from "../InputField/InputField";
import ReactMarkdown from "react-markdown";
import { getImageUrl } from "../../utils/getImgUrl";
import ErrorMessage from "../../pages/AuthPage/components/ErrorMessage/ErrorMessage";

interface ProjectFormProps {
	initialData: Project | null;
	onSuccess: () => void;
}

interface ProjectErrors {
	title?: string;
}

type ProjectFormData = Omit<Project, "_id"> & {
	description: string | "";
};

const ProjectForm = ({ initialData, onSuccess }: ProjectFormProps) => {
	const [projectForm, setProjectForm] = useState<ProjectFormData>({
		title: initialData?.title || "",
		description: initialData?.description || "",
		links: initialData?.links || [""],
		previewImage: initialData?.previewImage || "",
	});
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

	const handleSubmit = async () => {};

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
