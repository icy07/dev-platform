import { useNavigate } from "react-router-dom";
import type { Project } from "../../types";
import styles from "./ProjectCard.module.scss";
import { getImageUrl } from "../../utils/getImgUrl";
import placeholderImg from "../../assets/placeholder.svg";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useState } from "react";
import { deleteProjectRequest } from "../../api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { removeProject } from "../../store/slices/profileSlice";

interface ProjectCardProps {
	project: Project;
	isOwner: boolean;
	onEdit: (project: Project) => void;
}

const ProjectCard = ({ project, isOwner, onEdit }: ProjectCardProps) => {
	const navigate = useNavigate();

	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.profile.profile);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const handleDelete = async () => {
		await deleteProjectRequest(profile!._id, project._id);
		dispatch(removeProject(project._id));
		setIsConfirmOpen(false);
	};

	return (
		<>
			<div className={styles.card} onClick={() => navigate(`/project/${project._id}`)}>
				<div
					className={`${styles.card__img} ${project.previewImage ? "" : styles.card__imgPlaceholder}`}
				>
					<img
						src={project.previewImage ? getImageUrl(project.previewImage) : placeholderImg}
						alt={project.title}
					/>
				</div>
				<div className={styles.card__body}>
					<p className={styles.card__title}>{project.title}</p>

					{project.description && (
						<p className={styles.card__desc}>
							{project.description.length > 300
								? project.description.slice(0, 300) + "..."
								: project.description}
						</p>
					)}
				</div>
				{isOwner && (
					<div className={styles.card__actions}>
						<button
							className={styles.card__btn}
							onClick={(e) => {
								e.stopPropagation();
								onEdit(project);
							}}
							aria-label="Редактировать"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							>
								<path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
							</svg>
						</button>
						<button
							className={`${styles.card__btn} ${styles.card__btn_delete}`}
							onClick={(e) => {
								e.stopPropagation();
								setIsConfirmOpen(true);
								// onDelete(project._id);
							}}
							aria-label="Удалить"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							>
								<path d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
							</svg>
						</button>
					</div>
				)}
			</div>
			<ConfirmationModal
				isOpen={isConfirmOpen}
				title="Удалить проект из портфолио?"
				description="Это действие нельзя отменить"
				onConfirm={handleDelete}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</>
	);
};
export default ProjectCard;
