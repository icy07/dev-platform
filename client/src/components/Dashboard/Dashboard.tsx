import styles from "./Dashboard.module.scss";
import { can } from "../../utils/permissions";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { openModal } from "../../store/slices/postsSlice";

const Dashboard = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.auth);
	if (!user) return null;

	return (
		<div className={styles.dashboard}>
			<p className={styles.dashboard__title}>Добро пожаловать, {user.nickname}</p>
			<p className={styles.dashboard__role}>{user.role}</p>

			<div className={styles.dashboard__actions}>
				{can.createPost(user.role) && (
					<button className={styles.dashboard__btn} onClick={() => dispatch(openModal(null))}>
						Создать пост
					</button>
				)}
				{can.addPortfolio(user.role) && (
					<button className={styles.dashboard__btn}>Добавить проект в портфолио</button>
				)}
				{can.applyToVacancy(user.role) && (
					<button className={styles.dashboard__btn}>Откликнуться на вакансию</button>
				)}
				{can.createVacancy(user.role) && (
					<button className={styles.dashboard__btn}>Создать вакансию</button>
				)}
				{can.inviteUsers(user.role) && (
					<button className={styles.dashboard__btn}>Пригласить пользователя в компанию</button>
				)}
				{can.manageTeams(user.role) && (
					<button className={styles.dashboard__btn}>Управление командами</button>
				)}
				{can.manageProjects(user.role) && (
					<button className={styles.dashboard__btn}>Управление проектами</button>
				)}
			</div>
		</div>
	);
};
export default Dashboard;
