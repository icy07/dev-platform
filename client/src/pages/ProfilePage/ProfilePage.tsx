import styles from "./ProfilePage.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserRequest } from "../../api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { openProfileModal, openProjectModal, setProfile } from "../../store/slices/profileSlice";
import Loader from "../../components/Loader/Loader";
import ProjectCard from "../../components/ProjectCard/ProjectCard";

const ProfilePage = () => {
	const { id } = useParams();

	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.profile.profile);
	const { user } = useSelector((state: RootState) => state.auth);

	const [isOwner, setIsOwner] = useState(false);

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		document.title = "Страница пользователя";
	}, []);

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			const { data } = await getUserRequest(id!);
			dispatch(setProfile(data));
			setLoading(false);
		};

		fetchProfile();
	}, [id]);

	useEffect(() => {
		if (user && profile) {
			setIsOwner(user.id === profile._id);
		}
	}, [user, profile]);

	return (
		<>
			{loading && (
				<div>
					<Loader />
				</div>
			)}
			{profile && (
				<div className={styles.profile}>
					<div className={styles.profile__wrapper}>
						<div className={styles.profile__top}>
							<h2 className={styles.profile__title}>Информация</h2>
							{isOwner && (
								<button
									className={styles.profile__btn}
									onClick={() => dispatch(openProfileModal())}
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
							)}
						</div>
						<div className={styles.profile__info}>
							<p>
								Имя: <span>{profile.firstName}</span>
							</p>
							<p>
								Фамилия: <span>{profile.lastName}</span>
							</p>
							<p>
								Никнейм: <span>{profile.nickname}</span>
							</p>
							<p>
								Роль: <span>{profile.role}</span>
							</p>
							{profile.workplace && (
								<p>
									Место работы: <span>{profile.workplace}</span>
								</p>
							)}
							{profile.description && (
								<p>
									Описание: <span>{profile.description}</span>
								</p>
							)}
						</div>
					</div>
					<div className={styles.profile__wrapper}>
						<div className={styles.profile__top}>
							<h2 className={styles.profile__title}>Портфолио</h2>
							{isOwner && (
								<button
									className={styles.profile__btn}
									onClick={() => dispatch(openProjectModal(null))}
								>
									<span>+</span> Добавить проект
								</button>
							)}
						</div>
						{profile.portfolio.length > 0 && (
							<div className={styles.profile__projects}>
								{profile.portfolio.map((project) => (
									<ProjectCard
										project={project}
										isOwner={isOwner}
										key={project._id}
										onEdit={() => dispatch(openProjectModal(project))}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};
export default ProfilePage;
