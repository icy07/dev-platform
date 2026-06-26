import styles from "./ProjectPage.module.scss";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import type { Project, UserProfile } from "../../types";
import { deleteProjectRequest, getUserRequest } from "../../api/usersApi";
import Loader from "../../components/Loader/Loader";
import { getImageUrl } from "../../utils/getImgUrl";
import ReactMarkdown from "react-markdown";
import { openProjectModal, removeProject } from "../../store/slices/profileSlice";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const ProjectPage = () => {
	const { id, projectId } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.auth);

	const [loading, setLoading] = useState<boolean>(false);
	const [userinfo, setUserInfo] = useState<Partial<UserProfile>>({
		firstName: "",
		lastName: "",
		_id: "",
	});
	const [project, setPoject] = useState<Partial<Project>>({
		title: "",
		description: "",
		links: [],
		previewImage: "",
	});
	const [isOwner, setIsOwner] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	useEffect(() => {
		document.title = "Страница пользователя";
	}, []);

	useEffect(() => {
		const getProject = async () => {
			setLoading(true);
			const { data } = await getUserRequest(id!);

			const { firstName, lastName, _id } = data;
			const project = data.portfolio.find((project: Project) => project._id === projectId);

			setUserInfo({ firstName, lastName, _id });
			setPoject(project);

			setLoading(false);
		};

		getProject();
	}, []);

	useEffect(() => {
		if (user && userinfo) {
			setIsOwner(user.id === userinfo._id);
		}
	}, [user, userinfo]);

	const handleDelete = async () => {
		await deleteProjectRequest(userinfo._id!, project._id!);
		dispatch(removeProject(project._id!));
		setIsConfirmOpen(false);
		navigate(`/profile/${user?.id}`);
	};

	return (
		<>
			{loading && (
				<div>
					<Loader />
				</div>
			)}
			{project && (
				<>
					<div className={styles.project}>
						<div className={styles.project__wrapper}>
							{isOwner && (
								<div className={styles.project__actions}>
									<button
										className={styles.project__btn}
										onClick={(e) => {
											e.stopPropagation();
											dispatch(openProjectModal(project as Project));
										}}
									>
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										>
											<path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
										</svg>
										Редактировать
									</button>
									<button
										className={`${styles.project__btn} ${styles.project__btn_delete}`}
										onClick={(e) => {
											e.stopPropagation();
											setIsConfirmOpen(true);
										}}
									>
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										>
											<path d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
										</svg>
										Удалить
									</button>
								</div>
							)}
							{project.previewImage && (
								<div className={styles.project__imageWrapper}>
									<img
										src={getImageUrl(project.previewImage)}
										alt={project.title}
										className={styles.project__image}
									/>
								</div>
							)}
						</div>

						<div className={styles.project__content}>
							<h1 className={styles.project__title}>{project.title}</h1>

							<p className={styles.project__author}>
								Автор:{" "}
								<Link to={`/profile/${id}`}>
									{userinfo.firstName} {userinfo.lastName}
								</Link>
							</p>
							{project.description && (
								<div className={styles.project__section}>
									<h2>Описание</h2>
									<div className={styles.project__description}>
										<ReactMarkdown>{project.description}</ReactMarkdown>
									</div>
								</div>
							)}

							{project.links!.length > 0 && (
								<div className={styles.project__section}>
									<h2>Ссылки</h2>

									<ul className={styles.project__links}>
										{project.links!.map((link) => (
											<li key={link}>
												<a href={link} target="_blank">
													{link}
												</a>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
					<ConfirmationModal
						isOpen={isConfirmOpen}
						title="Удалить проект из портфолио?"
						description="Это действие нельзя отменить"
						onConfirm={handleDelete}
						onCancel={() => setIsConfirmOpen(false)}
					/>
				</>
			)}
		</>
	);
};
export default ProjectPage;
